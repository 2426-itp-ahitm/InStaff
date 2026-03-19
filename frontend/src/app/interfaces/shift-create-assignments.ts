import { AssignmentCreate } from "./assignment-create";
import { ShiftCreate } from "./shift-create";

export interface ShiftCreateAssignments {
    shiftCreateDTO: ShiftCreate;
    assignmentCreateDTOs: AssignmentCreate[];
}
