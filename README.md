# 3D Rubiks Cube Solver
Created using React, FastAPI, OpenCV, and THREE.js
App scans an unsolved Rubik's cube and returns a solution that the user can follow along with a 3D rendering of their cube.

## How to Run the Project
1.  Clone repository by entering the following into your terminal: 
```bash
git clone https://github.com/dannyjimenez98/Rubiks-Cube-Solver.git
```
2. Change into the project's directory and into the solver folder
```bash
cd Rubiks-Cube-Solver/solver
```
3. Install project's required Python dependencies
```bash
pip install -r requirements.txt
```
5. Run the FastAPI script
```bash
uvicorn api:app --reload
```
5. Open a new terminal and enter the frontend folder of the project directory
```bash
cd Rubiks-Cube-Solver/frontend
```
6. Install dependencies
```bash
npm install
```
7. Start the frontend server
```bash
npm start
```
Go to ```http://localhost:3000``` and solve away!

## Screenshots
<img width="610" alt="Screenshot 2024-07-18 at 9 14 19 PM" src="https://github.com/user-attachments/assets/7327812e-3d7c-4c15-9ba1-20f9e311d56d">
<img width="691" alt="Screenshot 2024-07-18 at 9 10 55 PM" src="https://github.com/user-attachments/assets/ae850f55-b00d-40e4-af11-cf6cd6c68e15">
