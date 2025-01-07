import { _decorator, Component, input, Input, KeyCode, Vec2 } from 'cc';
import { ControlTypes, PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

@ccclass('ControlWithKeyboard')
export class ControlWithKeyboard extends Component {

    @property(PlayerController)
    private playerController: PlayerController = null!;

    private controlType: ControlTypes;

    // Основные кнопки для перемещения игрока
    private upKey: KeyCode;
    private downKey: KeyCode;
    private leftKey: KeyCode;
    private rightKey: KeyCode;

    private currentDirection: Vec2 = new Vec2(); // Текущее направление вектора
    private keysPressed: Set<KeyCode> = new Set(); // Хранит нажатые клавиши

    protected start(): void {
        this.playerController = this.getComponent(PlayerController);
        if (!this.playerController) {
            console.error("PlayerController not found!");
        }
        this.controlType = this.playerController.getControlType();
        this.currentDirection = this.playerController.getCurrentDirection();

        // В зависимости от типа управления выбираем соответсвующие кнопки
        this.upKey = this.controlType == ControlTypes.WASD_KEYS_CONTROL ? KeyCode.KEY_W : KeyCode.ARROW_UP;
        this.downKey = this.controlType == ControlTypes.WASD_KEYS_CONTROL ? KeyCode.KEY_S : KeyCode.ARROW_DOWN;
        this.leftKey = this.controlType == ControlTypes.WASD_KEYS_CONTROL ? KeyCode.KEY_A : KeyCode.ARROW_LEFT;
        this.rightKey = this.controlType == ControlTypes.WASD_KEYS_CONTROL ? KeyCode.KEY_D : KeyCode.ARROW_RIGHT;
    }

    protected onLoad(): void {
        // Обработка ввода с клавиатуры
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    protected onDestroy(): void {
        // Убираем обработчики ввода при уничтожении
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    private onKeyDown(event: any): void {
        // Добавляем нажатую клавишу в keyPressed
        this.keysPressed.add(event.keyCode);
        this.updateDirection();
    }

    private onKeyUp(event: any): void {
        // Удаляем отпущенную клавишу из keyPressed
        this.keysPressed.delete(event.keyCode);
        this.updateDirection();
    }

    // Обновляем направление в зависимости от нажатых клавиш
    private updateDirection(): void {
        // Сбрасываем текущее направление
        this.currentDirection.set(0, 0);

        // Проверяем состояние нажатых клавиш и обновляем направление с помощью switch case
        for (const key of this.keysPressed) {
            switch (key) {
                // В зависимости от типа управления выбираем определённые кнопки
                case this.upKey:
                    this.currentDirection.y = 1;
                    break;
                case this.downKey:
                    this.currentDirection.y = -1;
                    break;
                case this.leftKey:
                    this.currentDirection.x = -1;
                    break;
                case this.rightKey:
                    this.currentDirection.x = 1;
                    break;
            }
        }
        // Обновляем направление вектора движения игрока
        this.playerController.setCurrentDirection(this.currentDirection);
    }
}