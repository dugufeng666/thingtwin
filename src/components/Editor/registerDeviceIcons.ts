import { register, Pen } from '@meta2d/core';

// 扩展 Pen 类型以包含自定义属性
interface CustomPen extends Pen {
  z?: number;
  props?: {
    custom: Array<{
      key: string;
      label: string;
      type: string;
      min?: number;
      placeholder?: string;
    }>;
  };
  offsetX?: number;
  lineTop?: number;
  lineLeft?: number;
  fillStyle?: string;
  strokeStyle?: string;
  stroke?: string;
  list?: Array<{ text: string }>;
}

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
    icon: '/shapes/rect.svg',
    create(pen: Pen) {
      const customPen = pen as CustomPen;
      customPen.width = 100;
      customPen.height = 100;
      customPen.name = 'rectangle';
      customPen.strokeStyle = 'rgb(0, 31, 151)';
      return customPen;
    }
  } as any);

  // 矩形
  register({
    name: 'l-rectangle',
    icon: '/shapes/rectangle.svg',
    create(pen: Pen) {
      const customPen = pen as CustomPen;
      customPen.width = 200;
      customPen.height = 50;
      customPen.name = 'rectangle';
      customPen.borderRadius = 0.1;
      customPen.strokeStyle = 'rgb(0, 31, 151)';
      return customPen;
    }
  } as any);

  // 圆形
  register({
    name: 'l-circle',
    icon: '/shapes/circle.svg',
    create(pen: Pen) {
      const customPen = pen as CustomPen;
      customPen.width = 100;
      customPen.height = 100;
      customPen.name = 'circle';
      customPen.strokeStyle = 'rgb(0, 31, 151)';
      return customPen;
    }
  } as any);

  // 三角形
  register({
    name: 'l-triangle',
    icon: '/shapes/triangle.svg',
    create(pen: Pen) {
      const customPen = pen as CustomPen;
      customPen.width = 100;
      customPen.height = 100;
      customPen.name = 'triangle';
      customPen.strokeStyle = 'rgb(0, 31, 151)';
      return customPen;
    }
  } as any);

  // 菱形
  register({
    name: 'l-diamond',
    icon: '/shapes/diamond.svg',
    create(pen: Pen) {
      const customPen = pen as CustomPen;
      customPen.width = 100;
      customPen.height = 100;
      customPen.name = 'diamond';
      customPen.strokeStyle = 'rgb(0, 31, 151)';
      return customPen;
    }
  } as any);

  // 五边形
  register({
    name: 'l-pentagon',
    icon: '/shapes/pentagon.svg',
    create(pen: Pen) {
      const customPen = pen as CustomPen;
      customPen.width = 100;
      customPen.height = 100;
      customPen.name = 'pentagon';
      customPen.strokeStyle = 'rgb(0, 31, 151)';
      return customPen;
    }
  } as any);

  // 六边形
  register({
    name: 'l-hexagon',
    icon: '/shapes/hexagon.svg',
    create(pen: Pen) {
      const customPen = pen as CustomPen;
      customPen.width = 100;
      customPen.height = 100;
      customPen.name = 'hexagon';
      customPen.strokeStyle = 'rgb(0, 31, 151)';
      return customPen;
    }
  } as any);

  // 五角星
  register({
    name: 'l-pentagram',
    icon: '/shapes/pentagram.svg',
    create(pen: Pen) {
      const customPen = pen as CustomPen;
      customPen.width = 100;
      customPen.height = 100;
      customPen.name = 'pentagram';
      customPen.strokeStyle = 'rgb(0, 31, 151)';
      return customPen;
    }
  } as any);

  // 左箭头
  register({
    name: 'l-arrow-left',
    icon: '/shapes/arrow-left.svg',
    create(pen: Pen) {
      const customPen = pen as CustomPen;
      customPen.width = 120;
      customPen.height = 60;
      customPen.name = 'leftArrow';
      customPen.strokeStyle = 'rgb(0, 31, 151)';
      return customPen;
    }
  } as any);

  // 右箭头
  register({
    name: 'l-arrow-right',
    icon: '/shapes/arrow-right.svg',
    create(pen: Pen) {
      const customPen = pen as CustomPen;
      customPen.width = 120;
      customPen.height = 60;
      customPen.name = 'rightArrow';
      customPen.strokeStyle = 'rgb(0, 31, 151)';
      return customPen;
    }
  } as any);

  // 双向箭头
  register({
    name: 'l-twoway-arrow',
    icon: '/shapes/twoway-arrow.svg',
    create(pen: Pen) {
      const customPen = pen as CustomPen;
      customPen.width = 150;
      customPen.height = 60;
      customPen.name = 'twowayArrow';
      customPen.strokeStyle = 'rgb(0, 31, 151)';
      return customPen;
    }
  } as any);

  // 云形
  register({
    name: 'l-cloud',
    icon: '/shapes/cloud.svg',
    create(pen: Pen) {
      const customPen = pen as CustomPen;
      customPen.width = 100;
      customPen.height = 100;
      customPen.name = 'cloud';
      customPen.strokeStyle = 'rgb(0, 31, 151)';
      return customPen;
    }
  } as any);

  // 消息框
  register({
    name: 'l-msg',
    icon: '/shapes/msg.svg',
    create(pen: Pen) {
      const customPen = pen as CustomPen;
      customPen.width = 100;
      customPen.height = 100;
      customPen.name = 'message';
      customPen.textTop = -0.1;
      customPen.strokeStyle = 'rgb(0, 31, 151)';
      return customPen;
    }
  } as any);

  // 文件
  register({
    name: 'l-file',
    icon: '/shapes/file.svg',
    create(pen: Pen) {
      const customPen = pen as CustomPen;
      customPen.width = 80;
      customPen.height = 100;
      customPen.name = 'file';
      customPen.strokeStyle = 'rgb(0, 31, 151)';
      return customPen;
    }
  } as any);

  // 立方体
  register({
    name: 'l-cube',
    icon: '/shapes/cube.svg',
    create(pen: Pen) {
      const customPen = pen as CustomPen;
      customPen.width = 100;
      customPen.height = 100;
      customPen.name = 'cube';
      customPen.strokeStyle = 'rgb(0, 31, 151)';
      return customPen;
    }
  } as any);

  // 人形
  register({
    name: 'l-people',
    icon: '/shapes/people.svg',
    create(pen: Pen) {
      const customPen = pen as CustomPen;
      customPen.width = 70;
      customPen.height = 100;
      customPen.name = 'people';
      customPen.strokeStyle = 'rgb(0, 31, 151)';
      return customPen;
    }
  } as any);
}

// 流程图形状注册
function registerFlowShapes() {
  // 开始/结束
  register({
    name: 'l-flow-start',
    icon: '/shapes/flow-start.svg',
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
    icon: '/shapes/flow-process.svg',
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
    icon: '/shapes/flow-decision.svg',
    create(pen: Pen) {
      pen.width = 120;
      pen.height = 60;
      pen.name = 'diamond';
      pen.text = '判定';
      return pen;
    }
  } as any);

  // 数据
  register({
    name: 'l-flow-data',
    icon: '/shapes/flow-data.svg',
    create(pen: CustomPen) {
      pen.width = 120;
      pen.height = 50;
      pen.name = 'flowData';
      pen.text = '数据';
      pen.offsetX = 0.14;
      return pen;
    }
  } as any);

  // 准备
  register({
    name: 'l-flow-ready',
    icon: '/shapes/flow-ready.svg',
    create(pen: Pen) {
      pen.width = 120;
      pen.height = 50;
      pen.name = 'hexagon';
      pen.text = '准备';
      return pen;
    }
  } as any);

  // 子流程
  register({
    name: 'l-flow-subprocess',
    icon: '/shapes/flow-subprocess.svg',
    create(pen: Pen) {
      pen.width = 120;
      pen.height = 50;
      pen.name = 'flowSubprocess';
      pen.text = '子流程';
      return pen;
    }
  } as any);

  // 数据库
  register({
    name: 'l-db',
    icon: '/shapes/db.svg',
    create(pen: Pen) {
      pen.width = 80;
      pen.height = 120;
      pen.name = 'flowDb';
      pen.text = '数据库';
      return pen;
    }
  } as any);

  // 文档
  register({
    name: 'l-flow-document',
    icon: '/shapes/flow-document.svg',
    create(pen: Pen) {
      pen.width = 120;
      pen.height = 100;
      pen.name = 'flowDocument';
      pen.text = '文档';
      return pen;
    }
  } as any);
}

// 活动图形状注册
function registerActivityShapes() {
  // 开始
  register({
    name: 'l-activity-start',
    icon: '/shapes/activity-start.svg',
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
    icon: '/shapes/activity-final.svg',
    create(pen: Pen) {
      pen.width = 30;
      pen.height = 30;
      pen.name = 'activityFinal';
      return pen;
    }
  } as any);

  // 活动
  register({
    name: 'l-action',
    icon: '/shapes/action.svg',
    create(pen: Pen) {
      pen.width = 120;
      pen.height = 50;
      pen.name = 'rectangle';
      pen.text = '活动';
      pen.borderRadius = 0.25;
      return pen;
    }
  } as any);

  // 决策/合并
  register({
    name: 'l-activity-decision',
    icon: '/shapes/activity-decision.svg',
    create(pen: Pen) {
      pen.width = 120;
      pen.height = 50;
      pen.name = 'diamond';
      pen.text = '决策/合并';
      return pen;
    }
  } as any);

  // 垂直泳道
  register({
    name: 'l-swimlane-v',
    icon: '/shapes/swimlane-v.svg',
    create(pen: CustomPen) {
      pen.width = 200;
      pen.height = 500;
      pen.name = 'swimlaneV';
      pen.text = '垂直泳道';
      pen.textBaseline = 'top';
      pen.textTop = 20;
      pen.lineTop = 0.08;
      return pen;
    }
  } as any);

  // 水平泳道
  register({
    name: 'l-swimlane-h',
    icon: '/shapes/swimlane-h.svg',
    create(pen: CustomPen) {
      pen.width = 500;
      pen.height = 200;
      pen.name = 'swimlaneH';
      pen.text = '水平泳道';
      pen.textWidth = 0.01;
      pen.textLeft = 0.04;
      pen.textAlign = 'left';
      pen.lineLeft = 0.08;
      return pen;
    }
  } as any);

  // 垂直分岔/汇合
  register({
    name: 'l-fork-v',
    icon: '/shapes/fork-v.svg',
    create(pen: CustomPen) {
      pen.width = 10;
      pen.height = 150;
      pen.name = 'forkV';
      pen.text = '垂直分岔/汇合';
      pen.fillStyle = '#555';
      pen.strokeStyle = 'transparent';
      return pen;
    }
  } as any);

  // 水平分岔/汇合
  register({
    name: 'l-fork-h',
    icon: '/shapes/fork-h.svg',
    create(pen: CustomPen) {
      pen.width = 150;
      pen.height = 10;
      pen.name = 'forkH';
      pen.text = '水平分岔/汇合';
      pen.fillStyle = '#555';
      pen.strokeStyle = 'transparent';
      return pen;
    }
  } as any);
}

// 时序图和类图形状注册
function registerSequenceShapes() {
  // 生命线
  register({
    name: 'l-lifeline',
    icon: '/shapes/lifeline.svg',
    create(pen: Pen) {
      pen.width = 150;
      pen.height = 400;
      pen.name = 'lifeline';
      pen.text = '生命线';
      pen.textHeight = 50;
      return pen;
    }
  } as any);

  // 激活
  register({
    name: 'l-focus',
    icon: '/shapes/focus.svg',
    create(pen: Pen) {
      pen.width = 12;
      pen.height = 200;
      pen.name = 'sequenceFocus';
      pen.text = '激活';
      return pen;
    }
  } as any);

  // 简单类
  register({
    name: 'l-simple-class',
    icon: '/shapes/simple-class.svg',
    create(pen: CustomPen) {
      pen.width = 270;
      pen.height = 200;
      pen.name = 'simpleClass';
      pen.text = 'Topology';
      pen.textHeight = 200;
      pen.textAlign = 'center';
      pen.textBaseline = 'top';
      pen.textTop = 10;
      pen.list = [
        {
          text: '- name: string\n+ setName(name: string): void',
        },
      ];
      return pen;
    }
  } as any);

  // 类
  register({
    name: 'l-class',
    icon: '/shapes/class.svg',
    create(pen: CustomPen) {
      pen.width = 270;
      pen.height = 200;
      pen.name = 'interfaceClass';
      pen.text = 'Topology';
      pen.textHeight = 200;
      pen.textAlign = 'center';
      pen.textBaseline = 'top';
      pen.textTop = 10;
      pen.list = [
        {
          text: '- name: string',
        },
        {
          text: '+ setName(name: string): void',
        },
      ];
      return pen;
    }
  } as any);
}

// 故障树形状注册
function registerFaultTreeShapes() {
  // 与门
  register({
    name: 'l-and-gate',
    icon: '/shapes/and-gate.svg',
    create(pen: Pen) {
      pen.width = 100;
      pen.height = 150;
      pen.name = 'andGate';
      return pen;
    }
  } as any);

  // 基本事件
  register({
    name: 'l-basic-event',
    icon: '/shapes/basic-event.svg',
    create(pen: Pen) {
      pen.width = 100;
      pen.height = 150;
      pen.name = 'basicEvent';
      return pen;
    }
  } as any);

  // 未展开事件
  register({
    name: 'l-unexpanded-event',
    icon: '/shapes/unexpanded-event.svg',
    create(pen: Pen) {
      pen.width = 100;
      pen.height = 150;
      pen.name = 'unexpandedEvent';
      return pen;
    }
  } as any);

  // 优先AND门
  register({
    name: 'l-priority-and-gate',
    icon: '/shapes/priority-and-gate.svg',
    create(pen: Pen) {
      pen.width = 100;
      pen.height = 150;
      pen.name = 'priorityAndGate';
      return pen;
    }
  } as any);

  // 禁止门
  register({
    name: 'l-forbidden-gate',
    icon: '/shapes/forbidden-gate.svg',
    create(pen: Pen) {
      pen.width = 100;
      pen.height = 150;
      pen.name = 'forbiddenGate';
      return pen;
    }
  } as any);

  // 事件
  register({
    name: 'l-event',
    icon: '/shapes/event.svg',
    create(pen: Pen) {
      pen.width = 100;
      pen.height = 150;
      pen.name = 'event';
      return pen;
    }
  } as any);

  // 开关事件
  register({
    name: 'l-switch-event',
    icon: '/shapes/switch-event.svg',
    create(pen: Pen) {
      pen.width = 100;
      pen.height = 150;
      pen.name = 'switchEvent';
      return pen;
    }
  } as any);

  // 条件事件
  register({
    name: 'l-conditional-event',
    icon: '/shapes/conditional-event.svg',
    create(pen: Pen) {
      pen.width = 150;
      pen.height = 100;
      pen.name = 'conditionalEvent';
      return pen;
    }
  } as any);

  // 转移符号
  register({
    name: 'l-transfer-symbol',
    icon: '/shapes/transfer-symbol.svg',
    create(pen: Pen) {
      pen.width = 100;
      pen.height = 150;
      pen.name = 'transferSymbol';
      return pen;
    }
  } as any);

  // 或门
  register({
    name: 'l-or-gate',
    icon: '/shapes/or-gate.svg',
    create(pen: Pen) {
      pen.width = 100;
      pen.height = 150;
      pen.name = 'orGate';
      return pen;
    }
  } as any);

  // 异或门
  register({
    name: 'l-xor-gate',
    icon: '/shapes/xor-gate.svg',
    create(pen: Pen) {
      pen.width = 100;
      pen.height = 150;
      pen.name = 'xorGate';
      return pen;
    }
  } as any);

  // 表决门
  register({
    name: 'l-voting-gate',
    icon: '/shapes/voting-gate.svg',
    create(pen: Pen) {
      pen.width = 100;
      pen.height = 150;
      pen.name = 'votingGate';
      return pen;
    }
  } as any);
}

// 脑图形状注册
function registerMindShapes() {
  // 主题
  register({
    name: 'l-mind-node',
    icon: '/shapes/mind-node.svg',
    create(pen: Pen) {
      pen.width = 200;
      pen.height = 50;
      pen.name = 'mindNode';
      pen.text = '主题';
      pen.borderRadius = 0.5;
      return pen;
    }
  } as any);

  // 子主题
  register({
    name: 'l-mind-line',
    icon: '/shapes/mind-line.svg',
    create(pen: Pen) {
      pen.width = 160;
      pen.height = 40;
      pen.name = 'mindLine';
      pen.text = '子主题';
      return pen;
    }
  } as any);
} 