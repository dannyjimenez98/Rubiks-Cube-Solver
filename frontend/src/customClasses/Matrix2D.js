class Matrix2D {
    constructor() {
      this.reset();
    }
  
    reset() {
      this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }
  
    translate(tx, ty) {
      const t = [1, 0, tx, 0, 1, ty, 0, 0, 1];
      this.apply(t);
    }
  
    rotate(angle) {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      const r = [c, -s, 0, s, c, 0, 0, 0, 1];
      this.apply(r);
    }
  
    apply(matrix) {
      if (matrix instanceof Matrix2D) {
        matrix = matrix.elements;
      }
      const result = new Array(9);
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          result[row * 3 + col] = 0;
          for (let k = 0; k < 3; k++) {
            result[row * 3 + col] +=
              this.elements[row * 3 + k] * matrix[k * 3 + col];
          }
        }
      }
      this.elements = result;
    }
  }
  export default Matrix2D;