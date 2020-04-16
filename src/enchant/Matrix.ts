
export default class Matrix {
    static instance = new Matrix();

    stack: number[][];

    constructor() {
        this.reset();
    }

    reset() {
        this.stack = [];
        this.stack.push([1, 0, 0, 1, 0, 0]);
    }

    makeTransformMatrix(node: Node, dest: number[]) {
        let x = node._x;
        let y = node._y;
        let width = node.width || 0;
        let height = node.height || 0;
        let rotation = node._rotation || 0;
        let scaleX = (typeof node._scaleX === 'number') ? node._scaleX : 1;
        let scaleY = (typeof node._scaleY === 'number') ? node._scaleY : 1;
        let theta = rotation * Math.PI / 180;
        let tmpcos = Math.cos(theta);
        let tmpsin = Math.sin(theta);
        let w = (typeof node._originX === 'number') ? node._originX : width / 2;
        let h = (typeof node._originY === 'number') ? node._originY : height / 2;
        let a = scaleX * tmpcos;
        let b = scaleX * tmpsin;
        let c = scaleY * tmpsin;
        let d = scaleY * tmpcos;

        dest[0] = a;
        dest[1] = b;
        dest[2] = -c;
        dest[3] = d;
        dest[4] = (-a * w + c * h + x + w);
        dest[5] = (-b * w - d * h + y + h);
    }

    multiply(m1: number[], m2: number[], dest: number[]) {
        let a11 = m1[0], a21 = m1[2], adx = m1[4],
            a12 = m1[1], a22 = m1[3], ady = m1[5];
        let b11 = m2[0], b21 = m2[2], bdx = m2[4],
            b12 = m2[1], b22 = m2[3], bdy = m2[5];

        dest[0] = a11 * b11 + a21 * b12;
        dest[1] = a12 * b11 + a22 * b12;
        dest[2] = a11 * b21 + a21 * b22;
        dest[3] = a12 * b21 + a22 * b22;
        dest[4] = a11 * bdx + a21 * bdy + adx;
        dest[5] = a12 * bdx + a22 * bdy + ady;
    }

    multiplyVec(mat, vec: number[], dest) {
        let x = vec[0], y = vec[1];
        let m11 = mat[0], m21 = mat[2], mdx = mat[4],
            m12 = mat[1], m22 = mat[3], mdy = mat[5];
        dest[0] = m11 * x + m21 * y + mdx;
        dest[1] = m12 * x + m22 * y + mdy;
    }
}
