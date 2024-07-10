import { IComponent } from "../Base/IComponent";
import { ecs_component } from "../ECSDefines";
import { AppearanceSystem } from "../System/AppearanceSystem";

@ecs_component(AppearanceSystem)
/** 外观 */
export class ApprComp extends IComponent {
    icon: string = ""
}
