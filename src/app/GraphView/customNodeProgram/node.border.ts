/**
 * This class copies sigma/rendering/webgl/programs/node.fast, but with a tiny
 * difference: The fragment shader ("./node.border.frag.glsl") draws a white
 * disc with a colored border.
 */

import { floatColor } from "sigma/utils";
import { NodeDisplayData } from "sigma/types";
import { AbstractNodeProgram } from "sigma/rendering/webgl/programs/common/node";
import { RenderParams } from "sigma/rendering/webgl/programs/common/program";

const vertexShaderSource = `
attribute vec2 a_position;
attribute float a_size;
attribute vec4 a_color;

uniform float u_ratio;
uniform float u_scale;
uniform mat3 u_matrix;

void main() {
  gl_Position = vec4(
    (u_matrix * vec3(a_position, 1)).xy,
    0,
    1
  );

  // Multiply the point size twice:
  //  - x SCALING_RATIO to correct the canvas scaling
  //  - x 2 to correct the formulae
  gl_PointSize = a_size * u_ratio * u_scale * 20.0;
}
`

const fragmentShaderSource = `
void main() {
  vec4 rect = vec4(0.2, 0.3, 0.4, 0.5);
  
  gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
}
`

const POINTS = 1, ATTRIBUTES = 4;

export default class NodeProgramBorder extends AbstractNodeProgram {
  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);
    this.bind();
  }

  process(data: NodeDisplayData, hidden: boolean, offset: number): void {
    // console.log(data);
    
    const array = this.array;
    let i = offset * POINTS * ATTRIBUTES;

    if (hidden) {
      array[i++] = 0;
      array[i++] = 0;
      array[i++] = 0;
      array[i++] = 0;
      return;
    }

    const color = floatColor(data.color);

    array[i++] = data.x;
    array[i++] = data.y;
    array[i++] = data.size;
    array[i] = color;    
  }

  render(params: RenderParams): void {
    const gl = this.gl;

    const program = this.program;
    gl.useProgram(program);

    gl.uniform1f(this.ratioLocation, 1 / Math.sqrt(params.ratio));
    gl.uniform1f(this.scaleLocation, params.scalingRatio);
    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);

    // gl.drawArrays(gl.POINTS, 0, 8);
    // 
    gl.drawArrays(gl.POINTS, 0, this.array.length / ATTRIBUTES);
  }
}