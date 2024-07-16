import numpy as np
import cv2

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
    'up': [None] * 9,
    'right': [None] * 9,
    'front': [None] * 9,
    'down': [None] * 9,
    'left': [None] * 9,
    'back': [None] * 9
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
        [cx-100, cy-100], [cx+00, cy-100], [cx+100, cy-100],
        [cx-100, cy+00], [cx+00, cy+00], [cx+100, cy+00],
        [cx-100, cy+100], [cx+00, cy+100], [cx+100, cy+100],
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
        cv2.rectangle(frame, (c[0]-10, c[1]+10), (c[0]+10, c[1]-10), (b, g, r), -1)
        face_colors.append(color)

    return face_colors