import numpy as np
import cv2
from pprint import pprint
import kociemba

# BGR Constants
colors = {
    'BLUE': np.uint8([[[255, 0, 0]]]),
    'RED': np.uint8([[[0, 0, 255]]]),
    'GREEN': np.uint8([[[0, 127, 0]]]),
    'ORANGE': np.uint8([[[0, 127, 255]]]),
    'YELLOW': np.uint8([[[0, 255, 255]]]),
    'WHITE': np.uint8([[[255, 255, 255]]]),
    'BLACK': np.uint8([[[0, 0, 0]]])
}

# Face color states
cube_state = {
    'up': ['BLACK'] * 9,
    'right': ['BLACK'] * 9,
    'front': ['BLACK'] * 9,
    'down': ['BLACK'] * 9,
    'left': ['BLACK'] * 9,
    'back': ['BLACK'] * 9
}

scan_helper_text_dict = {
    'up': ['WHITE', 'blue'],
    'right': ['RED', 'white'],
    'front': ['GREEN', 'white'],
    'down': ['YELLOW', 'green'],
    'left': ['ORANGE', 'white'],
    'back': ['BLUE', 'white']
}


def get_color(h, s, v):
    if (h in range(170, 180) and s in range(120,255) and v in range(70,255)):
        return 'RED'
    if h in range(90, 130) and s in range(50,255) and v in range(50,255):
        return 'BLUE'
    if h in range(0, 15) and s in range(50,255) and v in range(50,255):
        return 'ORANGE'
    if h in range(36, 86) and s in range(46,255) and v in range(0,255):
        return 'GREEN'
    if h in range(22, 45) and s in range(93,255) and v in range(0,255):
        return 'YELLOW'
    if h in range(0, 255) and s in range(0,75) and v in range(180,255):
        return 'WHITE'

    return 'WHITE'

def detect_color(cx, cy, frame, hsv):
    # center point of each sticker of a face that detects the sticker color
    sticker_centers = [
        [cx-50, cy-50], [cx+00, cy-50], [cx+50, cy-50],
        [cx-50, cy+00], [cx+00, cy+00], [cx+50, cy+00],
        [cx-50, cy+50], [cx+00, cy+50], [cx+50, cy+50],
    ]

    # TODO: for logo, try getting hsv values for the center at different pixels, then average them out to get color
    face_colors = []
    for c in sticker_centers:
        pixel_center = hsv[c[1], c[0]]
        h = pixel_center[0]
        s = pixel_center[1]
        v = pixel_center[2]
        
        color = get_color(h, s, v)
        
        b, g, r = int(colors[color][0][0][0]), int(colors[color][0][0][1]), int(colors[color][0][0][2])
        cv2.rectangle(frame, (c[0]-5, c[1]+5), (c[0]+5, c[1]-5), (b, g, r), -1)
        face_colors.append(color)

    return face_colors

cap = cv2.VideoCapture(0)
def scan_faces(face,cap):
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 500)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 500)

    while True:
        _, frame = cap.read()
        height, width, _ = frame.shape

        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

        cx = int(width / 2)
        cy = int(height / 2)

        detect_color(cx, cy, frame, hsv)

        cv2.putText(frame, f"{scan_helper_text_dict[face][0]}", (cx-75, cy-80), cv2.FONT_HERSHEY_SIMPLEX, 1, (int(colors[scan_helper_text_dict[face][0]][0][0][0]),
                                                                                                              int(colors[scan_helper_text_dict[face][0]][0][0][1]),
                                                                                                              int(colors[scan_helper_text_dict[face][0]][0][0][2])), 2)
        cv2.putText(frame, f"({scan_helper_text_dict[face][1]} on top)", (cx-75, cy-110), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (int(colors[scan_helper_text_dict[face][1].upper()][0][0][0]),
                                                                                                                          int(colors[scan_helper_text_dict[face][1].upper()][0][0][1]),
                                                                                                                          int(colors[scan_helper_text_dict[face][1].upper()][0][0][2])), 2)

        # Top Row
        s1 = cv2.rectangle(frame, (cx-75, cy-75), (cx-25, cy-25), (0, 255, 0), 1)
        s2 = cv2.rectangle(frame, (cx-25, cy-75), (cx+25, cy-25), (0, 255, 0), 1)
        s3 = cv2.rectangle(frame, (cx+25, cy-75), (cx+75, cy-25), (0, 255, 0), 1)
        # Middle Row
        s4 = cv2.rectangle(frame, (cx-75, cy-25), (cx-25, cy+25), (0, 255, 0), 1)
        s5 = cv2.rectangle(frame, (cx-25, cy-25), (cx+25, cy+25), (0, 255, 0), 1)
        s6 = cv2.rectangle(frame, (cx+25, cy-25), (cx+75, cy+25), (0, 255, 0), 1)
        # Bottom Row
        s7 = cv2.rectangle(frame, (cx-75, cy+25), (cx-25, cy+75), (0, 255, 0), 1)
        s8 = cv2.rectangle(frame, (cx-25, cy+25), (cx+25, cy+75), (0, 255, 0), 1)
        s9 = cv2.rectangle(frame, (cx+25, cy+25), (cx+75, cy+75), (0, 255, 0), 1)


        cv2.imshow('frame', frame)

        # lock in face by hitting return key
        if cv2.waitKey(1) & 0xFF == ord('\r'):
            cube_state[face] = detect_color(cx, cy, frame, hsv)
            break
    
for face in cube_state.keys():
    scan_faces(face, cap)

cap.release()
cv2.destroyAllWindows()
cv2.waitKey(1)

pprint(cube_state)

def format_cube_state(cube_state):
    color_map = {'GREEN': 'F', 
                 'WHITE': 'U', 
                 'ORANGE': 'L',
                 'RED': 'R',
                 'YELLOW': 'D',
                 'BLUE': 'B'} 
    return ''.join([color_map[color] for face in cube_state for color in cube_state[face]])


formatted_state=format_cube_state(cube_state)
pprint(formatted_state)

solution = kociemba.solve(formatted_state)

print(f'Solution: {solution}')
