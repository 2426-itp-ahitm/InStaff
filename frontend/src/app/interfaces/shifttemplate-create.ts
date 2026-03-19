import { TemplateroleCreate } from "./templaterole-create";

export interface ShifttemplateCreate {
    shiftTemplateName: string;
    templateRoles: TemplateroleCreate[];
}
