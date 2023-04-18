import { createEdgeCompoundProgram } from 'sigma/rendering/webgl/programs/common/edge.js';
import EdgeArrowHeadProgram from './edge.arrowHead.js';
import EdgeClampedProgram from 'sigma/rendering/webgl/programs/edge.clamped.js';

const EdgeArrowProgram = createEdgeCompoundProgram([
  EdgeClampedProgram,
  EdgeArrowHeadProgram,
]);

export default EdgeArrowProgram;
