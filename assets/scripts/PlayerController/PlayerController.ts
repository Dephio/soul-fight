import { _decorator, Component, Enum, RigidBody2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

/** ---
 * @en
 * -
 * Possible types of player controls:  
 * - `WASD_KEYS_CONTROL` - control using the keys: W , A , S , D .  
 * - `ARROW_KEYS_CONTROL` - control using the keys: ↑ , ← , ↓ , → .  
 * - `TOUCH_KEYS_CONTROL` - touch control ___(mobile devices only)___.  
 *
 * Default value - `WASD_KEYS_CONTROL`.  
 *
 * ---
 * @ru
 * -
 * Возможные типы управлнения игроком:  
 * - `WASD_KEYS_CONTROL` - управление при помощи клавиш: W , A , S , D .  
 * - `ARROW_KEYS_CONTROL` - управление при помощи клавиш: ↑ , ← , ↓ , → .  
 * - `TOUCH_KEYS_CONTROL` - сенсорное управление ___(только для мобильных устройств)___.  
 *
 * Значение по умолчанию - `WASD_KEYS_CONTROL`.  
 */

export enum ControlTypes { WASD_KEYS_CONTROL, ARROW_KEYS_CONTROL, TOUCH_KEYS_CONTROL };

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property(RigidBody2D)
    private rigidBody: RigidBody2D = null!;

    @property
    private moveSpeed: number = 1000; // Скорость движения игрока

    @property({type: Enum(ControlTypes)})
    // По умолчанию, управление игроком осуществляется при помощью кнопок WASD
    private controlType: ControlTypes = ControlTypes.WASD_KEYS_CONTROL;

    private currentDirection: Vec2 = new Vec2(); // Направление вектора движения игрока
    private lastDirection: Vec2 = new Vec2(); // Последнее использованное направление вектора

    protected start(): void {
        this.rigidBody = this.getComponent(RigidBody2D);
        if (!this.rigidBody) {
            console.error("RigidBody2D not found!");
        }
    }

    protected update(dt: number): void {
        // Обновляем скорость только в том случае, если изменилось направление
        if (!this.currentDirection.equals(this.lastDirection)) {
            this.updateMovement(dt);
            this.lastDirection.set(this.currentDirection);
        }
    }

    private updateMovement(deltaTime: number): void {
        // Устанавливаем скорость Rigidbody в зависимости от текущего направления
        const velocity = this.currentDirection.normalize().multiplyScalar(this.moveSpeed * deltaTime);
        this.rigidBody.linearVelocity = velocity;
    }

    public getMoveSpeed(): number {
        return this.moveSpeed;
    }

    public setMoveSpeed(newMoveSpeed: number) {
        this.moveSpeed = newMoveSpeed;
    }

    public getControlType(): ControlTypes {
        return this.controlType;
    }

    public setControlType(newControlType: ControlTypes) {
        this.controlType = newControlType;
    }

    public getCurrentDirection(): Vec2 {
        return this.currentDirection;
    }

    public setCurrentDirection(newCurrentDirection: Vec2) {
        this.currentDirection.set(newCurrentDirection);
    }
}