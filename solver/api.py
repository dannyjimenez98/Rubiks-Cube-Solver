from main import cube_state, scan_faces, scan_helper_text_dict, colors, detect_color 
# format_cube_state
# ,solution
from fastapi import FastAPI, HTTPException, Response, Depends, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import cv2
import json
import kociemba

app = FastAPI()

cap = cv2.VideoCapture(0)

# Allow connection with frontend (React)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/cube_state")
def get_cube_state():
    try:
        return cube_state
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def format_cube_state(cube_state):
    color_map = {'GREEN': 'F', 
                 'WHITE': 'U', 
                 'ORANGE': 'L',
                 'RED': 'R',
                 'YELLOW': 'D',
                 'BLUE': 'B'} 
    return ''.join([color_map[color] for face in cube_state for color in cube_state[face]])

@app.get("/solution")
def get_solution():
    try:
        formatted_state=format_cube_state(cube_state)
        solution = kociemba.solve(formatted_state)
        if solution:
            print(solution)
        return solution
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

current_face_index = 0
faces = list(cube_state.keys())
key_pressed=None
def generate(cap):
    global key_pressed, current_face_index, scanning_complete
    scanning_complete = False
    try:
        key_pressed = None
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 500)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 500)
        while True:            
            ret, frame = cap.read()
            height, width, _ = frame.shape
            hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

            cx = int(width / 2)
            cy = int(height / 2)

            current_face = faces[current_face_index]
            detect_color(cx, cy, frame, hsv)
            
            cv2.putText(frame, f"{scan_helper_text_dict[current_face][0]}", (cx-75, cy-80), cv2.FONT_HERSHEY_SIMPLEX, 1, (int(colors[scan_helper_text_dict[current_face][0]][0][0][0]),
                                                                                                              int(colors[scan_helper_text_dict[current_face][0]][0][0][1]),
                                                                                                              int(colors[scan_helper_text_dict[current_face][0]][0][0][2])), 2)
            cv2.putText(frame, f"({scan_helper_text_dict[current_face][1]} on top)", (cx-75, cy-110), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (int(colors[scan_helper_text_dict[current_face][1].upper()][0][0][0]),
                                                                                                                          int(colors[scan_helper_text_dict[current_face][1].upper()][0][0][1]),
                                                                                                                          int(colors[scan_helper_text_dict[current_face][1].upper()][0][0][2])), 2)

            
            # Top Row
            cv2.rectangle(frame, (cx-75, cy-75), (cx-25, cy-25), (0, 255, 0), 1)
            cv2.rectangle(frame, (cx-25, cy-75), (cx+25, cy-25), (0, 255, 0), 1)
            cv2.rectangle(frame, (cx+25, cy-75), (cx+75, cy-25), (0, 255, 0), 1)
            # Middle Row
            cv2.rectangle(frame, (cx-75, cy-25), (cx-25, cy+25), (0, 255, 0), 1)
            cv2.rectangle(frame, (cx-25, cy-25), (cx+25, cy+25), (0, 255, 0), 1)
            cv2.rectangle(frame, (cx+25, cy-25), (cx+75, cy+25), (0, 255, 0), 1)
            # Bottom Row
            cv2.rectangle(frame, (cx-75, cy+25), (cx-25, cy+75), (0, 255, 0), 1)
            cv2.rectangle(frame, (cx-25, cy+25), (cx+25, cy+75), (0, 255, 0), 1)
            cv2.rectangle(frame, (cx+25, cy+25), (cx+75, cy+75), (0, 255, 0), 1)


            binary_string = cv2.imencode('.png', frame)[1].tobytes()
            yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' +
                        binary_string + b'\r\n') 
            
            if key_pressed == "enter":
                print(current_face_index)
                print(len(faces)-1)
                cube_state[current_face] = detect_color(cx, cy, frame, hsv)
                key_pressed = None
                print(current_face_index == len(faces)-1)
                current_face_index+=1
                if (current_face_index >= len(faces)):
                    scanning_complete = True

    except:
        print("disconnected")


def camera_setup():
    cap = cv2.VideoCapture(0)
    return cap

@app.get("/video_feed")
async def video_feed(cap=Depends(camera_setup)):
    return StreamingResponse(generate(cap), media_type="multipart/x-mixed-replace; boundary=frame")


@app.post("/key_press")
async def key_press(request: Request):
    global key_pressed
    body = await request.body()
    key_pressed = json.loads(body).get("key")
    return {"status": "ok"}

@app.post("/stop_video")
async def stop_video():
    global scanning_complete
    if (scanning_complete == True):
        cap.release()
        cv2.destroyAllWindows()
        cv2.waitKey(1)
        return scanning_complete
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

