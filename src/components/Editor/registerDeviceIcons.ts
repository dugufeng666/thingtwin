import { register, Pen } from '@meta2d/core';

// 注册所有图形
export function registerGraphics() {
  // 注册设备图标
  registerDeviceIcons();
  // 注册基本形状
  registerBasicShapes();
  // 注册流程图
  registerFlowShapes();
  // 注册活动图
  registerActivityShapes();
  // 注册时序图和类图
  registerSequenceShapes();
  // 注册故障树
  registerFaultTreeShapes();
  // 注册脑图
  registerMindShapes();
}

// 设备图标注册
function registerDeviceIcons() {
  // 阀门
  register({
    name: 'l-device-valve',
    icon: 'l-device-valve',
    data: {
      name: 'image',
      text: '',
      width: 40,
      height: 40,
      image: '/devices/valve.svg'
    }
  } as any);

  // 流量计
  register({
    name: 'l-device-flowmeter',
    icon: 'l-device-flowmeter',
    data: {
      name: 'image',
      text: '',
      width: 60,
      height: 60,
      image: '/devices/flowmeter.svg'
    }
  } as any);

  // 分集水器
  register({
    name: 'l-device-separator',
    icon: '/devices/separator.svg',
    data: {
      name: 'image',
      text: '',
      width: 100,
      height: 40,
      image: '/devices/separator.svg'
    }
  } as any);

  // 加药泵
  register({
    name: 'l-device-pump',
    icon: '/devices/pump.svg',
    data: {
      name: 'image',
      text: '',
      width: 40,
      height: 80,
      image: '/devices/pump.svg'
    }
  } as any);

  // 加药箱
  register({
    name: 'l-device-tank',
    icon: '/devices/tank.svg',
    data: {
      name: 'image',
      text: '',
      width: 60,
      height: 100,
      image: '/devices/tank.svg'
    }
  } as any);

  // 加药箱2
  register({
    name: 'l-device-tank2',
    icon: '/devices/tank2.svg',
    data: {
      name: 'image',
      text: '',
      width: 60,
      height: 100,
      image: '/devices/tank2.svg'
    }
  } as any);

  // 压力表
  register({
    name: 'l-device-gauge',
    icon: '/devices/gauge.svg',
    data: {
      name: 'image',
      text: '',
      width: 60,
      height: 60,
      image: '/devices/gauge.svg'
    }
  } as any);

  // 压滤机
  register({
    name: 'l-device-filter',
    icon: '/devices/filter.svg',
    data: {
      name: 'image',
      text: '',
      width: 120,
      height: 40,
      image: '/devices/filter.svg'
    }
  } as any);

  // 回流泵
  register({
    name: 'l-device-pump2',
    icon: '/devices/pump2.svg',
    data: {
      name: 'image',
      text: '',
      width: 80,
      height: 40,
      image: '/devices/pump2.svg'
    }
  } as any);

  // 废水池
  register({
    name: 'l-device-pool',
    icon: '/devices/pool.svg',
    data: {
      name: 'image',
      text: '',
      width: 120,
      height: 120,
      image: '/devices/pool.svg'
    }
  } as any);

  // 排水泵
  register({
    name: 'l-device-drain',
    icon: '/devices/drain.svg',
    data: {
      name: 'image',
      text: '',
      width: 80,
      height: 40,
      image: '/devices/drain.svg'
    }
  } as any);

  // 污泥收集
  register({
    name: 'l-device-sludge',
    icon: '/devices/sludge.svg',
    data: {
      name: 'image',
      text: '',
      width: 120,
      height: 120,
      image: '/devices/sludge.svg'
    }
  } as any);

  // 污泥泵
  register({
    name: 'l-device-sludge-pump',
    icon: '/devices/sludge-pump.svg',
    data: {
      name: 'image',
      text: '',
      width: 40,
      height: 100,
      image: '/devices/sludge-pump.svg'
    }
  } as any);

  // 沉淀池
  register({
    name: 'l-device-settling',
    icon: '/devices/settling.svg',
    data: {
      name: 'image',
      text: '',
      width: 150,
      height: 150,
      image: '/devices/settling.svg'
    }
  } as any);
}

// 基本形状注册
function registerBasicShapes() {
  // 正方形
  register({
    name: 'l-rect',
    icon: 'l-rect',
    create(pen: Pen) {
      pen.width = 100;
      pen.height = 100;
      pen.name = 'rectangle';
      return pen;
    }
  } as any);

  // 矩形
  register({
    name: 'l-rectangle',
    icon: 'l-rectangle',
    create(pen: Pen) {
      pen.width = 200;
      pen.height = 50;
      pen.name = 'rectangle';
      pen.borderRadius = 0.1;
      return pen;
    }
  } as any);

  // 圆形
  register({
    name: 'l-circle',
    icon: 'l-circle',
    create(pen: Pen) {
      pen.width = 100;
      pen.height = 100;
      pen.name = 'circle';
      return pen;
    }
  } as any);

  // 三角形
  register({
    name: 'l-triangle',
    icon: 'l-triangle',
    create(pen: Pen) {
      pen.width = 100;
      pen.height = 100;
      pen.name = 'triangle';
      return pen;
    }
  } as any);

  // 菱形
  register({
    name: 'l-diamond',
    icon: 'l-diamond',
    create(pen: Pen) {
      pen.width = 100;
      pen.height = 100;
      pen.name = 'diamond';
      return pen;
    }
  } as any);
}

// 流程图形状注册
function registerFlowShapes() {
  // 开始/结束
  register({
    name: 'l-flow-start',
    icon: 'l-flow-start',
    create(pen: Pen) {
      pen.width = 120;
      pen.height = 40;
      pen.name = 'rectangle';
      pen.text = '开始/结束';
      pen.borderRadius = 0.5;
      return pen;
    }
  } as any);

  // 流程
  register({
    name: 'l-flow-process',
    icon: 'l-rectangle',
    create(pen: Pen) {
      pen.width = 120;
      pen.height = 40;
      pen.name = 'rectangle';
      pen.text = '流程';
      return pen;
    }
  } as any);

  // 判定
  register({
    name: 'l-flow-decision',
    icon: 'l-diamond',
    create(pen: Pen) {
      pen.width = 120;
      pen.height = 60;
      pen.name = 'diamond';
      pen.text = '判定';
      return pen;
    }
  } as any);
}

// 活动图形状注册
function registerActivityShapes() {
  // 开始
  register({
    name: 'l-activity-start',
    icon: 'l-inital',
    create(pen: Pen) {
      pen.width = 30;
      pen.height = 30;
      pen.name = 'circle';
      pen.background = '#555';
      pen.lineWidth = 0;
      return pen;
    }
  } as any);

  // 结束
  register({
    name: 'l-activity-final',
    icon: 'l-final',
    create(pen: Pen) {
      pen.width = 30;
      pen.height = 30;
      pen.name = 'circle';
      pen.background = '#000';
      pen.lineWidth = 0;
      return pen;
    }
  } as any);
}

// 时序图和类图形状注册
function registerSequenceShapes() {
  // 生命线
  register({
    name: 'l-lifeline',
    icon: 'l-lifeline',
    create(pen: Pen) {
      pen.width = 150;
      pen.height = 400;
      pen.name = 'rectangle';
      pen.textHeight = 50;
      return pen;
    }
  } as any);
}

// 故障树形状注册
function registerFaultTreeShapes() {
  // 与门
  register({
    name: 'l-and-gate',
    icon: 'l-ANDmen',
    create(pen: Pen) {
      pen.width = 100;
      pen.height = 150;
      pen.name = 'rectangle';
      return pen;
    }
  } as any);
}

// 脑图形状注册
function registerMindShapes() {
  // 主题
  register({
    name: 'l-mind-node',
    icon: 'l-zhuti',
    create(pen: Pen) {
      pen.width = 200;
      pen.height = 50;
      pen.name = 'rectangle';
      pen.text = '主题';
      pen.borderRadius = 0.5;
      return pen;
    }
  } as any);
} 