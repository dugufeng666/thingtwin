// 污水处理组件库定义
export const wastewaterComponents = () => {
  return [
    {
      name: 'wastewaterTreatment',
      icon: 'wastewater',
      title: '污水处理组件',
      children: [
        {
          name: '泵',
          icon: 'pump',
          data: {
            text: '',
            name: 'pump',
            width: 80,
            height: 80,
            image: './components/symbols/pump.svg',
          }
        },
        {
          name: '阀门',
          icon: 'valve',
          data: {
            text: '',
            name: 'valve',
            width: 60,
            height: 60,
            image: './components/symbols/valve.svg',
          }
        },
        {
          name: '流量计',
          icon: 'flowmeter',
          data: {
            text: '',
            name: 'flowmeter',
            width: 80,
            height: 80,
            image: './components/symbols/flowmeter.svg',
          }
        },
        {
          name: '过滤器',
          icon: 'filter',
          data: {
            text: '',
            name: 'filter',
            width: 80,
            height: 100,
            image: './components/symbols/filter.svg',
          }
        },
        {
          name: '曝气池',
          icon: 'aeration',
          data: {
            text: '',
            name: 'aeration',
            width: 120,
            height: 100,
            image: './components/symbols/aeration.svg',
          }
        },
        {
          name: '沉淀池',
          icon: 'settling',
          data: {
            text: '',
            name: 'settling',
            width: 120,
            height: 100,
            image: './components/symbols/settling.svg',
          }
        },
        {
          name: '消毒池',
          icon: 'chlorination',
          data: {
            text: '',
            name: 'chlorination',
            width: 100,
            height: 100,
            image: './components/symbols/chlorination.svg',
          }
        },
        {
          name: '储罐',
          icon: 'tank',
          data: {
            text: '',
            name: 'tank',
            width: 100,
            height: 120,
            image: './components/symbols/tank.svg',
          }
        },
        // 新增组件
        {
          name: '污泥池',
          icon: 'sludge-tank',
          data: {
            text: '污泥池',
            name: 'sludgeTank',
            width: 160,
            height: 120,
            rect: {
              fill: 'rgba(102, 51, 0, 0.6)',
              strokeWidth: 2,
              stroke: '#cc8833',
              shadowColor: 'rgba(102, 51, 0, 0.3)',
              shadowBlur: 10
            }
          }
        },
        {
          name: '鼓风机',
          icon: 'blower',
          data: {
            text: '鼓风机',
            name: 'blower',
            width: 80,
            height: 80,
            rect: {
              fill: 'rgba(100, 100, 100, 0.6)',
              strokeWidth: 2,
              stroke: '#aaaaaa',
              shadowColor: 'rgba(200, 200, 200, 0.3)',
              shadowBlur: 10
            }
          }
        },
        {
          name: '脱水机',
          icon: 'dewatering',
          data: {
            text: '脱水机',
            name: 'dewatering',
            width: 100,
            height: 80,
            rect: {
              fill: 'rgba(70, 70, 120, 0.6)',
              strokeWidth: 2,
              stroke: '#666699'
            }
          }
        },
        {
          name: '除臭系统',
          icon: 'deodorization',
          data: {
            text: '除臭系统',
            name: 'deodorization',
            width: 100,
            height: 160,
            rect: {
              fill: 'rgba(50, 150, 50, 0.6)',
              strokeWidth: 2,
              stroke: '#339933'
            }
          }
        },
        {
          name: '回流泵',
          icon: 'return-pump',
          data: {
            text: '回流泵',
            name: 'returnPump',
            width: 80,
            height: 80,
            ellipse: {
              fill: 'rgba(0, 140, 220, 0.6)',
              strokeWidth: 2,
              stroke: '#00a0ff',
              shadowColor: 'rgba(0, 160, 255, 0.3)',
              shadowBlur: 10
            }
          }
        },
        {
          name: '排泥泵',
          icon: 'sludge-pump',
          data: {
            text: '排泥泵',
            name: 'sludgePump',
            width: 80,
            height: 80,
            ellipse: {
              fill: 'rgba(153, 51, 0, 0.6)',
              strokeWidth: 2,
              stroke: '#cc6633',
              shadowColor: 'rgba(204, 102, 51, 0.3)',
              shadowBlur: 10
            }
          }
        },
        {
          name: '提升泵',
          icon: 'lift-pump',
          data: {
            text: '提升泵',
            name: 'liftPump',
            width: 80,
            height: 80,
            ellipse: {
              fill: 'rgba(0, 153, 153, 0.6)',
              strokeWidth: 2,
              stroke: '#009999'
            }
          }
        },
        {
          name: '调节池',
          icon: 'regulation-tank',
          data: {
            text: '调节池',
            name: 'regulationTank',
            width: 120,
            height: 100,
            rect: {
              fill: 'rgba(0, 120, 180, 0.6)',
              strokeWidth: 2,
              stroke: '#0088cc',
              shadowColor: 'rgba(0, 136, 204, 0.3)',
              shadowBlur: 10
            }
          }
        },
        {
          name: '格栅',
          icon: 'screen',
          data: {
            text: '格栅',
            name: 'screen',
            width: 100,
            height: 60,
            rect: {
              fill: 'rgba(102, 102, 102, 0.6)',
              strokeWidth: 2,
              stroke: '#666666'
            }
          }
        },
        {
          name: '管道',
          icon: 'pipe',
          data: {
            name: 'pipe',
            lineName: 'line',
            lineWidth: 10,
            strokeStyle: '#00c8ff',
            dash: 0,
            shadowColor: 'rgba(0, 200, 255, 0.4)',
            shadowBlur: 5
          }
        },
        {
          name: '传感器',
          icon: 'sensor',
          data: {
            text: '传感器',
            name: 'sensor',
            width: 40,
            height: 40,
            ellipse: {
              fill: 'rgba(255, 153, 0, 0.6)',
              strokeWidth: 2,
              stroke: '#ffaa00',
              shadowColor: 'rgba(255, 170, 0, 0.3)',
              shadowBlur: 10
            }
          }
        },
        {
          name: '明渠',
          icon: 'channel',
          data: {
            text: '明渠',
            name: 'channel',
            width: 120,
            height: 60,
            rect: {
              fill: 'rgba(0, 153, 204, 0.6)',
              strokeWidth: 2,
              stroke: '#00aadd',
              shadowColor: 'rgba(0, 170, 221, 0.3)',
              shadowBlur: 10
            }
          }
        },
        // 新增更多污水处理组件
        {
          name: '二沉池',
          icon: 'secondary-settling',
          data: {
            text: '二沉池',
            name: 'secondarySettling',
            width: 140,
            height: 120,
            rect: {
              fill: 'rgba(0, 102, 153, 0.6)',
              strokeWidth: 2,
              stroke: '#0088cc',
              shadowColor: 'rgba(0, 136, 204, 0.3)',
              shadowBlur: 10
            }
          }
        },
        {
          name: '厌氧池',
          icon: 'anaerobic',
          data: {
            text: '厌氧池',
            name: 'anaerobicTank',
            width: 120,
            height: 100,
            rect: {
              fill: 'rgba(102, 0, 102, 0.6)',
              strokeWidth: 2,
              stroke: '#660066'
            }
          }
        },
        {
          name: 'SBR反应池',
          icon: 'sbr',
          data: {
            text: 'SBR反应池',
            name: 'sbrTank',
            width: 140,
            height: 120,
            rect: {
              fill: 'rgba(0, 153, 102, 0.6)',
              strokeWidth: 2,
              stroke: '#00cc88',
              shadowColor: 'rgba(0, 204, 136, 0.3)',
              shadowBlur: 10
            }
          }
        },
        {
          name: '接触氧化池',
          icon: 'contact-oxidation',
          data: {
            text: '接触氧化池',
            name: 'contactOxidation',
            width: 140,
            height: 120,
            rect: {
              fill: 'rgba(51, 153, 204, 0.6)',
              strokeWidth: 2,
              stroke: '#3399cc'
            }
          }
        },
        {
          name: '污泥浓缩池',
          icon: 'sludge-thickener',
          data: {
            text: '污泥浓缩池',
            name: 'sludgeThickener',
            width: 120,
            height: 120,
            ellipse: {
              fill: 'rgba(102, 51, 0, 0.6)',
              strokeWidth: 2,
              stroke: '#663300'
            }
          }
        },
        {
          name: '加药装置',
          icon: 'dosing-system',
          data: {
            text: '加药装置',
            name: 'dosingSystem',
            width: 80,
            height: 100,
            rect: {
              fill: 'rgba(204, 153, 0, 0.6)',
              strokeWidth: 2,
              stroke: '#cc9900'
            }
          }
        },
        {
          name: '紫外消毒',
          icon: 'uv-disinfection',
          data: {
            text: '紫外消毒',
            name: 'uvDisinfection',
            width: 100,
            height: 80,
            rect: {
              fill: 'rgba(153, 51, 153, 0.6)',
              strokeWidth: 2,
              stroke: '#993399'
            }
          }
        },
        {
          name: '进水泵站',
          icon: 'inlet-pump',
          data: {
            text: '进水泵站',
            name: 'inletPumpStation',
            width: 100,
            height: 100,
            rect: {
              fill: 'rgba(0, 102, 204, 0.6)',
              strokeWidth: 2,
              stroke: '#0066cc'
            }
          }
        },
        {
          name: '出水阀门',
          icon: 'outlet-valve',
          data: {
            text: '出水阀门',
            name: 'outletValve',
            width: 60,
            height: 60,
            ellipse: {
              fill: 'rgba(51, 102, 0, 0.6)',
              strokeWidth: 2,
              stroke: '#336600'
            }
          }
        },
        {
          name: '砂滤器',
          icon: 'sand-filter',
          data: {
            text: '砂滤器',
            name: 'sandFilter',
            width: 80,
            height: 120,
            rect: {
              fill: 'rgba(204, 102, 0, 0.6)',
              strokeWidth: 2,
              stroke: '#cc6600'
            }
          }
        },
        {
          name: 'A/O反应池',
          icon: 'ao-reactor',
          data: {
            text: 'A/O反应池',
            name: 'aoReactor',
            width: 160,
            height: 120,
            rect: {
              fill: 'rgba(0, 153, 153, 0.6)',
              strokeWidth: 2,
              stroke: '#009999'
            }
          }
        },
        {
          name: 'A²/O反应池',
          icon: 'a2o-reactor',
          data: {
            text: 'A²/O反应池',
            name: 'a2oReactor',
            width: 180,
            height: 120,
            rect: {
              fill: 'rgba(0, 153, 102, 0.6)',
              strokeWidth: 2,
              stroke: '#009966'
            }
          }
        },
        {
          name: '混凝池',
          icon: 'coagulation',
          data: {
            text: '混凝池',
            name: 'coagulationTank',
            width: 100,
            height: 100,
            rect: {
              fill: 'rgba(102, 102, 153, 0.6)',
              strokeWidth: 2,
              stroke: '#666699'
            }
          }
        },
        {
          name: '絮凝池',
          icon: 'flocculation',
          data: {
            text: '絮凝池',
            name: 'flocculationTank',
            width: 100,
            height: 100,
            rect: {
              fill: 'rgba(153, 102, 153, 0.6)',
              strokeWidth: 2,
              stroke: '#996699'
            }
          }
        },
        {
          name: '水质检测仪',
          icon: 'water-analyzer',
          data: {
            text: '水质检测仪',
            name: 'waterAnalyzer',
            width: 60,
            height: 60,
            rect: {
              fill: 'rgba(51, 153, 255, 0.6)',
              strokeWidth: 2,
              stroke: '#3399ff'
            }
          }
        },
        {
          name: '水质在线监测站',
          icon: 'monitoring-station',
          data: {
            text: '水质在线监测站',
            name: 'monitoringStation',
            width: 120,
            height: 80,
            rect: {
              fill: 'rgba(0, 204, 153, 0.6)',
              strokeWidth: 2,
              stroke: '#00cc99'
            }
          }
        },
        {
          name: '污泥干化床',
          icon: 'sludge-drying-bed',
          data: {
            text: '污泥干化床',
            name: 'sludgeDryingBed',
            width: 140,
            height: 100,
            rect: {
              fill: 'rgba(153, 102, 51, 0.6)',
              strokeWidth: 2,
              stroke: '#996633'
            }
          }
        }
      ]
    }
  ];
}

// 注册污水处理组件的SVG图标
export const registerWastewaterIcons = () => {
  const iconNames = [
    'pump', 'valve', 'flowmeter', 'filter', 
    'aeration', 'settling', 'chlorination', 'tank'
  ];
  
  // 创建SVG图标定义
  const svgIconDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgIconDefs.setAttribute('style', 'position: absolute; width: 0; height: 0');
  svgIconDefs.setAttribute('width', '0');
  svgIconDefs.setAttribute('height', '0');
  svgIconDefs.setAttribute('version', '1.1');
  svgIconDefs.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  
  // 添加污水处理图标
  iconNames.forEach(name => {
    const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', name);
    symbol.setAttribute('viewBox', '0 0 100 100');
    
    // 添加图片作为图标内容
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('href', `./components/symbols/${name}.svg`);
    image.setAttribute('width', '100');
    image.setAttribute('height', '100');
    
    symbol.appendChild(image);
    svgIconDefs.appendChild(symbol);
  });
  
  // 添加其他组件的简单图标
  // 污泥池
  addSimpleSymbol(svgIconDefs, 'sludge-tank', '#996633', (svg) => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '10');
    rect.setAttribute('y', '20');
    rect.setAttribute('width', '80');
    rect.setAttribute('height', '60');
    rect.setAttribute('fill', '#996633');
    rect.setAttribute('fill-opacity', '0.6');
    rect.setAttribute('stroke', '#996633');
    rect.setAttribute('stroke-width', '2');
    svg.appendChild(rect);
  });
  
  // 鼓风机
  addSimpleSymbol(svgIconDefs, 'blower', '#999999', (svg) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '30');
    circle.setAttribute('fill', '#999999');
    circle.setAttribute('fill-opacity', '0.6');
    circle.setAttribute('stroke', '#999999');
    circle.setAttribute('stroke-width', '2');
    svg.appendChild(circle);
    
    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line1.setAttribute('x1', '50');
    line1.setAttribute('y1', '20');
    line1.setAttribute('x2', '50');
    line1.setAttribute('y2', '80');
    line1.setAttribute('stroke', '#ffffff');
    line1.setAttribute('stroke-width', '4');
    svg.appendChild(line1);
    
    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('x1', '20');
    line2.setAttribute('y1', '50');
    line2.setAttribute('x2', '80');
    line2.setAttribute('y2', '50');
    line2.setAttribute('stroke', '#ffffff');
    line2.setAttribute('stroke-width', '4');
    svg.appendChild(line2);
  });
  
  // 脱水机
  addSimpleSymbol(svgIconDefs, 'dewatering', '#666699', (svg) => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '20');
    rect.setAttribute('y', '30');
    rect.setAttribute('width', '60');
    rect.setAttribute('height', '40');
    rect.setAttribute('fill', '#666699');
    rect.setAttribute('fill-opacity', '0.6');
    rect.setAttribute('stroke', '#666699');
    rect.setAttribute('stroke-width', '2');
    svg.appendChild(rect);
    
    for (let i = 0; i < 3; i++) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '30');
      line.setAttribute('y1', (40 + i * 10).toString());
      line.setAttribute('x2', '70');
      line.setAttribute('y2', (40 + i * 10).toString());
      line.setAttribute('stroke', '#ffffff');
      line.setAttribute('stroke-width', '2');
      svg.appendChild(line);
    }
  });
  
  // 除臭系统
  addSimpleSymbol(svgIconDefs, 'deodorization', '#339933', (svg) => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '30');
    rect.setAttribute('y', '20');
    rect.setAttribute('width', '40');
    rect.setAttribute('height', '60');
    rect.setAttribute('fill', '#339933');
    rect.setAttribute('fill-opacity', '0.6');
    rect.setAttribute('stroke', '#339933');
    rect.setAttribute('stroke-width', '2');
    svg.appendChild(rect);
    
    // 气泡
    for (let i = 0; i < 3; i++) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', (40 + i * 10).toString());
      circle.setAttribute('cy', '10');
      circle.setAttribute('r', '5');
      circle.setAttribute('fill', '#ffffff');
      circle.setAttribute('fill-opacity', '0.8');
      svg.appendChild(circle);
    }
  });
  
  // 回流泵、排泥泵、提升泵、管道、传感器等其他图标也类似添加...
  addSimpleSymbol(svgIconDefs, 'return-pump', '#0066cc', (svg) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '30');
    circle.setAttribute('fill', '#0066cc');
    circle.setAttribute('fill-opacity', '0.6');
    circle.setAttribute('stroke', '#0066cc');
    circle.setAttribute('stroke-width', '2');
    svg.appendChild(circle);
    
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arrow.setAttribute('d', 'M 30,50 L 70,50 L 60,40 M 60,60 L 70,50');
    arrow.setAttribute('stroke', '#ffffff');
    arrow.setAttribute('stroke-width', '3');
    arrow.setAttribute('fill', 'none');
    svg.appendChild(arrow);
  });
  
  addSimpleSymbol(svgIconDefs, 'sludge-pump', '#993300', (svg) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '30');
    circle.setAttribute('fill', '#993300');
    circle.setAttribute('fill-opacity', '0.6');
    circle.setAttribute('stroke', '#993300');
    circle.setAttribute('stroke-width', '2');
    svg.appendChild(circle);
    
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arrow.setAttribute('d', 'M 30,50 L 70,50 L 60,40 M 60,60 L 70,50');
    arrow.setAttribute('stroke', '#ffffff');
    arrow.setAttribute('stroke-width', '3');
    arrow.setAttribute('fill', 'none');
    svg.appendChild(arrow);
  });
  
  addSimpleSymbol(svgIconDefs, 'lift-pump', '#009999', (svg) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '30');
    circle.setAttribute('fill', '#009999');
    circle.setAttribute('fill-opacity', '0.6');
    circle.setAttribute('stroke', '#009999');
    circle.setAttribute('stroke-width', '2');
    svg.appendChild(circle);
    
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arrow.setAttribute('d', 'M 50,70 L 50,30 L 40,40 M 60,40 L 50,30');
    arrow.setAttribute('stroke', '#ffffff');
    arrow.setAttribute('stroke-width', '3');
    arrow.setAttribute('fill', 'none');
    svg.appendChild(arrow);
  });
  
  addSimpleSymbol(svgIconDefs, 'regulation-tank', '#006699', (svg) => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '20');
    rect.setAttribute('y', '30');
    rect.setAttribute('width', '60');
    rect.setAttribute('height', '40');
    rect.setAttribute('fill', '#006699');
    rect.setAttribute('fill-opacity', '0.6');
    rect.setAttribute('stroke', '#006699');
    rect.setAttribute('stroke-width', '2');
    svg.appendChild(rect);
    
    // 波浪线
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 20,45 C 30,35 40,55 50,45 C 60,35 70,55 80,45');
    path.setAttribute('stroke', '#ffffff');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    svg.appendChild(path);
  });
  
  addSimpleSymbol(svgIconDefs, 'screen', '#666666', (svg) => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '30');
    rect.setAttribute('y', '30');
    rect.setAttribute('width', '40');
    rect.setAttribute('height', '40');
    rect.setAttribute('fill', '#666666');
    rect.setAttribute('fill-opacity', '0.6');
    rect.setAttribute('stroke', '#666666');
    rect.setAttribute('stroke-width', '2');
    svg.appendChild(rect);
    
    // 格栅线
    for (let i = 0; i < 5; i++) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', (35 + i * 8).toString());
      line.setAttribute('y1', '30');
      line.setAttribute('x2', (35 + i * 8).toString());
      line.setAttribute('y2', '70');
      line.setAttribute('stroke', '#ffffff');
      line.setAttribute('stroke-width', '2');
      svg.appendChild(line);
    }
  });
  
  addSimpleSymbol(svgIconDefs, 'pipe', '#33ccff', (svg) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '10');
    line.setAttribute('y1', '50');
    line.setAttribute('x2', '90');
    line.setAttribute('y2', '50');
    line.setAttribute('stroke', '#33ccff');
    line.setAttribute('stroke-width', '10');
    line.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line);
    
    // 流动箭头
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arrow.setAttribute('d', 'M 60,40 L 70,50 L 60,60');
    arrow.setAttribute('stroke', '#ffffff');
    arrow.setAttribute('stroke-width', '2');
    arrow.setAttribute('fill', 'none');
    svg.appendChild(arrow);
  });
  
  addSimpleSymbol(svgIconDefs, 'sensor', '#ff9900', (svg) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '25');
    circle.setAttribute('fill', '#ff9900');
    circle.setAttribute('fill-opacity', '0.6');
    circle.setAttribute('stroke', '#ff9900');
    circle.setAttribute('stroke-width', '2');
    svg.appendChild(circle);
    
    // 传感器图案
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 40,40 L 60,60 M 40,60 L 60,40');
    path.setAttribute('stroke', '#ffffff');
    path.setAttribute('stroke-width', '3');
    svg.appendChild(path);
  });
  
  addSimpleSymbol(svgIconDefs, 'channel', '#0099cc', (svg) => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '20');
    rect.setAttribute('y', '40');
    rect.setAttribute('width', '60');
    rect.setAttribute('height', '20');
    rect.setAttribute('fill', '#0099cc');
    rect.setAttribute('fill-opacity', '0.6');
    rect.setAttribute('stroke', '#0099cc');
    rect.setAttribute('stroke-width', '2');
    svg.appendChild(rect);
    
    // 水流
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 20,50 C 30,45 40,55 50,50 C 60,45 70,55 80,50');
    path.setAttribute('stroke', '#ffffff');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    svg.appendChild(path);
  });
  
  // 修改组图标样式
  const groupSymbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
  groupSymbol.setAttribute('id', 'wastewater');
  groupSymbol.setAttribute('viewBox', '0 0 100 100');
  
  // 添加组图标
  const groupRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  groupRect.setAttribute('width', '100');
  groupRect.setAttribute('height', '100');
  groupRect.setAttribute('fill', '#0088cc');
  groupRect.setAttribute('opacity', '0.7');
  
  const groupText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  groupText.setAttribute('x', '50');
  groupText.setAttribute('y', '55');
  groupText.setAttribute('text-anchor', 'middle');
  groupText.setAttribute('font-size', '14');
  groupText.setAttribute('fill', 'white');
  groupText.textContent = '污水处理';
  
  groupSymbol.appendChild(groupRect);
  groupSymbol.appendChild(groupText);
  svgIconDefs.appendChild(groupSymbol);
  
  // 将图标添加到文档中
  document.body.appendChild(svgIconDefs);
};

// 帮助函数：添加简单的图标符号
function addSimpleSymbol(container, id, color, drawFn) {
  const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
  symbol.setAttribute('id', id);
  symbol.setAttribute('viewBox', '0 0 100 100');
  
  drawFn(symbol);
  
  container.appendChild(symbol);
} 