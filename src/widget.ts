// Copyright (c) Travis DePrato
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';

type Point = [number, number];

export class CanvasModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: CanvasModel.model_name,
      _model_module: CanvasModel.model_module,
      _model_module_version: CanvasModel.model_module_version,
      _view_name: CanvasModel.view_name,
      _view_module: CanvasModel.view_module,
      _view_module_version: CanvasModel.view_module_version,
      data: '',
      path: [],
      line_width: 10,
      size: [200, 200],
      color: false,
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };

  static model_name = 'CanvasModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'CanvasView';
  static view_module = MODULE_NAME;
  static view_module_version = MODULE_VERSION;
}

type Path = Array<Point | string | null>;

export class CanvasView extends DOMWidgetView {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  declare model: CanvasModel;

  // An array of points that forms the overall path that is drawn.
  // The path can can actually consist of multiple strokes. A null element
  // signifies the end of the previous stroke and the beginning of the next
  // stroke.
  private path: Path = Array.from(this.model.get('path'));
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private lastPoint: Point | null = null;
  private drawing = false;

  render(): void {
    this.el.classList.add('ipydraw-canvas');

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.model.get('size')[0];
    this.canvas.height = this.model.get('size')[1];
    this.canvas.style.border = '1px solid #ccc';

    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.context.lineWidth = this.model.get('line_width');
    this.context.strokeStyle = 'black';
    this.context.lineJoin = 'round';

    this.canvas.addEventListener('mousemove', this.onMouseMove);
    this.canvas.addEventListener('mousedown', this.onMouseDown);
    this.el.appendChild(this.canvas);
    this.el.appendChild(this.createClearButton());
    if (this.model.get('color')) {
      this.el.appendChild(this.createColorPicker());
    }
    this.redraw();
  }

  private currentPoint(event: MouseEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  }

  private onMouseMove = (e: MouseEvent) => {
    const point = this.currentPoint(e);
    this.lastPoint = point;
    if (!this.drawing) {
      return;
    }
    this.path.push(point);
    this.redraw();
  };

  private onMouseDown = (e: MouseEvent) => {
    this.lastPoint = this.currentPoint(e);
    this.drawing = true;
    window.addEventListener('mouseup', this.onMouseUp);
  };

  private onMouseUp = (e: MouseEvent) => {
    this.drawing = false;
    this.path.push(null);
    this.redraw();
    this.sendUpdate();
    window.removeEventListener('mouseup', this.onMouseUp);
  };

  private redraw() {
    const points = this.path || [];
    const context = this.context;
    let inStroke = false;

    context.strokeStyle = 'black';

    // always add a terminating null point
    for (const point of [...points, null]) {
      if (point === null) {
        if (inStroke) {
          context.stroke();
          context.closePath();
          inStroke = false;
        }
        continue;
      }
      if (typeof point === 'string') {
        // change color
        context.strokeStyle = point;
        continue;
      }
      if (!inStroke) {
        // start a new stroke
        context.moveTo(...point);
        context.beginPath();
        inStroke = true;
      } else {
        // continue the previous stroke
        context.lineTo(...point);
      }
    }
  }

  private sendUpdate() {
    this.model.set('data', this.canvas.toDataURL(), { updated_view: this });
    this.model.set('path', Array.from(this.path), { updated_view: this });
    this.touch();
  }

  private createClearButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.onclick = (e) => {
      e.preventDefault();
      this.path = [];
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.redraw();
      this.sendUpdate();
    };
    button.innerText = 'Clear';
    return button;
  }

  private createColorPicker(): HTMLElement {
    const input = document.createElement('input');
    input.type = 'color';

    // loop through the path to find the last set color
    for (const pt of this.path) {
      if (typeof pt === 'string') {
        input.value = pt;
      }
    }

    input.onchange = (event) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.path.push(event.currentTarget.value);
    };

    return input;
  }
}
