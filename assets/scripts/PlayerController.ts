import { _decorator, Component, input, Input, KeyCode, RigidBody2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property(RigidBody2D)
    private rigidBody: RigidBody2D = null!;

    @property
    private moveSpeed: number = 1000; // Скорость движения

    private currentDirection: Vec2 = new Vec2(0, 0);
    private lastDirection: Vec2 = new Vec2(0, 0);

    protected start(): void {
        // Обработка ввода с клавиатуры
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    protected onDestroy(): void {
        // Убираем обработчики ввода при уничтожении
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    protected update(dt: number): void {
        // Обновляем скорость только в том случае, если изменилось направление
        if (!this.currentDirection.equals(this.lastDirection)) {
            this.updateMovement(dt);
            this.lastDirection.set(this.currentDirection);
        }
    }

    private onKeyDown(event: any): void {
        // Обрабатываем сразу нажатие и кнопок WASD, и стрелок для управления
        switch (event.keyCode) {
            case KeyCode.ARROW_UP:
            case KeyCode.KEY_W:
                this.currentDirection.y = 1;
                break;
            case KeyCode.ARROW_DOWN:
            case KeyCode.KEY_S:
                this.currentDirection.y = -1;
                break;
            case KeyCode.ARROW_LEFT:
            case KeyCode.KEY_A:
                this.currentDirection.x = -1;
                break;
            case KeyCode.ARROW_RIGHT:
            case KeyCode.KEY_D:
                this.currentDirection.x = 1;
                break;
        }
    }

    private onKeyUp(event: any): void {
        // Используем группировку случаев case. Данное решение выбрано специально :D
        switch (event.keyCode) {
            case KeyCode.ARROW_UP:
            case KeyCode.ARROW_DOWN:
            case KeyCode.KEY_W:
            case KeyCode.KEY_S:
                this.currentDirection.y = 0;
                break;
            case KeyCode.ARROW_LEFT:
            case KeyCode.ARROW_RIGHT:
            case KeyCode.KEY_A:
            case KeyCode.KEY_D:
                this.currentDirection.x = 0;
                break;
        }
    }

    private updateMovement(deltaTime: number): void {
        // Устанавливаем скорость Rigidbody в зависимости от текущего направления
        const velocity = this.currentDirection.normalize().multiplyScalar(this.moveSpeed * deltaTime);
        this.rigidBody.linearVelocity = velocity;
    }
}