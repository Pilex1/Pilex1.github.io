import { IKeyTyped } from "./IKeyTyped";

export abstract class GraphicsComponent {
  protected disabled: boolean;
  protected pos: number[];
  private active: boolean;
  defaultActive: boolean = true;

  protected onKeyTyped: IKeyTyped;
}
