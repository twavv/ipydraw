// Copyright (c) Travis DePrato
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';

type Point = [number, number];
type Path = ReadonlyArray<Point>;

export class PointPickerModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: PointPickerModel.model_name,
      _model_module: PointPickerModel.model_module,
      _model_module_version: PointPickerModel.model_module_version,
      _view_name: PointPickerModel.view_name,
      _view_module: PointPickerModel.view_module,
      _view_module_version: PointPickerModel.view_module_version,
      points: [],
      n_points: null,
      image_src: '',
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };

  static model_name = 'PointPickerModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'PointPickerView';
  static view_module = MODULE_NAME;
  static view_module_version = MODULE_VERSION;
}

export class PointPickerView extends DOMWidgetView {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  declare model: PointPickerModel;

  // An array of points that forms the overall path that is drawn.
  // The path can can actually consist of multiple strokes. A null element
  // signifies the end of the previous stroke and the beginning of the next
  // stroke.
  private points: Path = Array.from(this.model.get('points'));
  private img: Promise<HTMLImageElement> = imgFromSrc(
    this.model.get('image_src')
  );

  get nPoints(): number {
    return this.model.get('n_points') as number;
  }

  render(): void {
    this.el.classList.add('ipydraw-canvas');

    this.canvas = document.createElement('canvas');
    this.canvas.style.border = '1px solid #ccc';

    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    // this.canvas.addEventListener('mousemove', this.onMouseMove);
    this.canvas.addEventListener('mousedown', this.onMouseDown);
    this.el.appendChild(this.canvas);
    this.el.appendChild(this.createClearButton());
    this.redraw();
  }

  private currentPoint(event: MouseEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  }

  private onMouseDown = (e: MouseEvent) => {
    // eslint-disable-next-line eqeqeq
    if (this.nPoints != null && this.points.length >= this.nPoints) {
      return;
    }
    const pt = this.currentPoint(e);
    this.setPoints([...this.points, pt]);
  };

  private setPoints(points: Array<Point>) {
    this.points = points;
    this.model.set('points', this.points, { updated_view: this });
    this.touch();
    this.redraw();
  }

  private async redraw() {
    const img = await this.img;
    this.canvas.width = img.width;
    this.canvas.height = img.height;

    const points = this.points || [];

    const c = this.context;
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    c.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    c.lineWidth = 3;
    c.strokeStyle = '#FF4444';

    const size = Math.max(
      Math.max(this.canvas.width, this.canvas.height) * 0.025,
      5
    );
    for (const [x, y] of points) {
      c.beginPath();
      c.moveTo(x - size, y);
      c.lineTo(x + size, y);
      c.moveTo(x, y - size);
      c.lineTo(x, y + size);
      c.stroke();
    }
  }

  private createClearButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.onclick = (e) => {
      e.preventDefault();
      this.setPoints([]);
    };
    button.innerText = 'Clear!';
    return button;
  }
}

async function imgFromSrc(src: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = src;
  await new Promise<void>((acc) => {
    img.onload = () => acc();
  });
  return img;
}
