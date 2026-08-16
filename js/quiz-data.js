/**
 * 中医体质自测 - 题库与体质定义
 * 基于中华中医药学会《中医体质分类与判定》(ZYYXH/T157-2009)
 * 九种体质，每种 5 道核心题，共 45 题
 * 评分：1=没有(从不) 2=很少 3=有时 4=经常 5=总是
 */

// 九种体质完整定义
const CONSTITUTIONS = [
  {
    code: 'ph',
    name: '平和质',
    enName: 'Balanced',
    color: '#52c41a',
    icon: '🌿',
    brief: '体态适中、面色红润、精力充沛，是最理想的健康体质。',
    features: ['面色红润', '精力充沛', '睡眠良好', '脾胃功能正常', '情绪稳定', '适应力强'],
    causes: '先天禀赋良好，后天饮食起居调养得当。',
    risks: '平时较少患病，患病也易于康复。',
    advice: {
      diet: '饮食有节，不偏食偏嗜，不过饥过饱，五味调和。',
      lifestyle: '起居有常，劳逸结合，顺应四时。',
      exercise: '坚持规律运动，如散步、慢跑、太极等，量力而行。',
      emotion: '保持平和乐观的心态，避免情绪过激。'
    },
    foodsGood: ['五谷杂粮', '蔬菜水果', '适量肉蛋奶', '豆制品'],
    foodsBad: ['无明显禁忌，但勿过食辛辣油腻']
  },
  {
    code: 'qx',
    name: '气虚质',
    enName: 'Qi-Deficient',
    color: '#fa8c16',
    icon: '💨',
    brief: '元气不足，气息低弱，机体脏腑功能状态低下。',
    features: ['容易疲乏', '气短懒言', '易出虚汗', '易感冒', '声音低弱'],
    causes: '先天禀赋不足，久病体虚，过度劳累，饮食失调，年老体衰。',
    risks: '易患感冒、内脏下垂、虚劳等病，病后恢复较慢。',
    advice: {
      diet: '宜益气健脾，多食小米、山药、大枣、鸡肉、牛肉、香菇等。',
      lifestyle: '起居宜规律，避免熬夜和过度劳累，注意保暖防感冒。',
      exercise: '宜柔缓运动，如散步、太极拳、八段锦，避免剧烈出汗运动。',
      emotion: '保持平和，避免过度思虑，培养兴趣爱好陶冶性情。'
    },
    foodsGood: ['小米', '山药', '大枣', '鸡肉', '牛肉', '香菇', '黄豆', '糯米'],
    foodsBad: ['生冷食物', '油腻厚味', '苦寒之品（如苦瓜）', '空心菜']
  },
  {
    code: 'yx',
    name: '阳虚质',
    enName: 'Yang-Deficient',
    color: '#13c2c2',
    icon: '❄️',
    brief: '阳气不足，失于温煦，以形寒肢冷为主要特征。',
    features: ['手足不温', '畏寒怕冷', '喜热饮食', '精神不振', '面色柔白'],
    causes: '先天禀赋不足，过食寒凉，久病伤阳，年老阳衰。',
    risks: '易患腹泻、水肿、痰饮、阳痿、痛经等病。',
    advice: {
      diet: '宜温阳益气，多食生姜、羊肉、牛肉、韭菜、桂圆等温性食物。',
      lifestyle: '起居注意保暖，尤其是腰腹足部，夏勿贪凉，冬重防寒。',
      exercise: '宜和缓有氧运动，如慢跑、太极拳，可晒太阳，避免汗出当风。',
      emotion: '保持开朗，多与人交流，避免独处郁结，培养豁达心境。'
    },
    foodsGood: ['生姜', '羊肉', '牛肉', '韭菜', '桂圆', '核桃', '栗子', '辣椒(适量)'],
    foodsBad: ['冷饮冰品', '西瓜', '梨', '苦瓜', '绿豆', '鸭肉', '螃蟹']
  },
  {
    code: 'yx2',
    name: '阴虚质',
    enName: 'Yin-Deficient',
    color: '#eb2f96',
    icon: '🔥',
    brief: '阴液亏少，以口燥咽干、手足心热为主要特征。',
    features: ['手足心热', '口燥咽干', '鼻微干', '喜冷饮', '大便干燥', '两颧潮红'],
    causes: '先天禀赋不足，过食辛温燥热，久病伤阴，熬夜耗阴，房劳过度。',
    risks: '易患失眠、便秘、消渴、内热等病。',
    advice: {
      diet: '宜滋阴润燥，多食银耳、百合、梨、鸭肉、枸杞、黑芝麻等。',
      lifestyle: '起居忌熬夜，避免高温出汗环境，午间宜小憩养阴。',
      exercise: '宜中小强度运动，如太极拳、瑜伽、游泳，避免大汗淋漓。',
      emotion: '保持沉静，避免急躁动怒，可练习静坐、冥想安神。'
    },
    foodsGood: ['银耳', '百合', '梨', '鸭肉', '枸杞', '黑芝麻', '蜂蜜', '莲藕'],
    foodsBad: ['辛辣燥热', '烧烤油炸', '羊肉', '狗肉', '韭菜', '辣椒', '烟酒']
  },
  {
    code: 'ts',
    name: '痰湿质',
    enName: 'Phlegm-Damp',
    color: '#722ed1',
    icon: '☁️',
    brief: '痰湿凝聚，以体形肥胖、腹部肥满为主要特征。',
    features: ['体形肥胖', '腹部肥满', '面部油脂多', '胸闷痰多', '口黏腻', '舌苔厚腻'],
    causes: '过食肥甘厚味，久坐少动，脾虚运化失常，先天禀赋。',
    risks: '易患消渴、中风、胸痹、高血脂、高血压等代谢性疾病。',
    advice: {
      diet: '宜清淡，多食白萝卜、冬瓜、薏苡仁、海带等化痰利湿之物，少食肥甘。',
      lifestyle: '起居宜动不宜静，避免潮湿环境，定期监测血脂血糖。',
      exercise: '宜持久有氧运动，如快走、慢跑、游泳，循序渐进减轻体重。',
      emotion: '保持活跃，多参加社交活动，避免懒散忧郁。'
    },
    foodsGood: ['白萝卜', '冬瓜', '薏苡仁', '海带', '荷叶', '山药', '陈皮', '赤小豆'],
    foodsBad: ['肥肉', '甜食', '奶油', '油炸食品', '酒类', '糯米', '石榴']
  },
  {
    code: 'sr',
    name: '湿热质',
    enName: 'Damp-Heat',
    color: '#f5222d',
    icon: '🌡️',
    brief: '湿热内蕴，以面垢油光、口苦为主要特征。',
    features: ['面垢油光', '口苦口干', '体味大', '大便黏滞', '小便短赤', '易生痤疮'],
    causes: '久居湿热环境，过食辛热肥甘，嗜烟酒，脾虚湿蕴化热。',
    risks: '易患疮疖、黄疸、热淋、痤疮、皮肤病等。',
    advice: {
      diet: '宜清热利湿，多食绿豆、苦瓜、薏苡仁、冬瓜、芹菜等，忌辛辣油腻烟酒。',
      lifestyle: '起居环境宜干燥通风，避免熬夜和湿热环境，保持皮肤清洁。',
      exercise: '宜中高强度运动，如跑步、球类，加大运动量以助散热祛湿。',
      emotion: '保持心境平和，避免急躁易怒，可听舒缓音乐调节。'
    },
    foodsGood: ['绿豆', '苦瓜', '薏苡仁', '冬瓜', '芹菜', '黄瓜', '西瓜', '绿茶'],
    foodsBad: ['辛辣', '烧烤', '油炸', '羊肉', '狗肉', '酒类', '甜食', '芒果']
  },
  {
    code: 'xy',
    name: '血瘀质',
    enName: 'Blood-Stasis',
    color: '#a8071a',
    icon: '🩸',
    brief: '血行不畅，以肤色晦暗、舌质紫暗为主要特征。',
    features: ['肤色晦暗', '唇色偏暗', '容易出现瘀斑', '黑眼圈', '健忘', '易烦躁'],
    causes: '情志不畅气郁血瘀，外伤跌扑，久病入络，年老气虚血行无力。',
    risks: '易患冠心病、脑血管病、肿瘤、痛经、症瘕等。',
    advice: {
      diet: '宜活血化瘀，多食山楂、玫瑰花、桃仁、黑豆、醋等，少食寒凉收涩之物。',
      lifestyle: '起居宜动静结合，避免久坐，注意保暖防寒凝血瘀。',
      exercise: '宜有助于气血运行的运动，如舞蹈、太极剑、健美操，保持活动。',
      emotion: '保持心情舒畅，避免郁结，多与人交流倾诉，培养乐观心态。'
    },
    foodsGood: ['山楂', '玫瑰花', '桃仁', '黑豆', '醋', '茄子', '油菜', '红糖'],
    foodsBad: ['寒凉食物', '收涩食物（如乌梅）', '高脂肪食物', '过咸食物']
  },
  {
    code: 'qy',
    name: '气郁质',
    enName: 'Qi-Stagnation',
    color: '#2f54eb',
    icon: '😔',
    brief: '气机郁滞，以情绪低落、忧虑脆弱为主要特征。',
    features: ['情绪低落', '多愁善感', '易紧张焦虑', '经常叹气', '咽喉异物感', '胁肋胀满'],
    causes: '情志不遂，精神刺激，忧思过度，先天禀赋偏颇。',
    risks: '易患失眠、抑郁、梅核气、脏躁、百合病等情志病证。',
    advice: {
      diet: '宜疏肝理气，多食玫瑰花、柑橘、佛手、萝卜、薄荷等，忌收敛酸涩。',
      lifestyle: '起居宜增加社交和户外活动，避免独处，培养兴趣爱好。',
      exercise: '宜群体性运动，如球类、舞蹈、跑步，运动助气机舒畅。',
      emotion: '学会情绪宣泄，多倾诉交流，必要时寻求心理帮助，保持乐观。'
    },
    foodsGood: ['玫瑰花', '柑橘', '佛手', '萝卜', '薄荷', '荞麦', '刀豆', '芹菜'],
    foodsBad: ['收敛酸涩（乌梅、石榴）', '咖啡', '浓茶', '辛辣刺激']
  },
  {
    code: 'tb',
    name: '特禀质',
    enName: 'Special-Diathesis',
    color: '#faad14',
    icon: '🌸',
    brief: '先天失常，以生理缺陷或过敏反应为主要特征。',
    features: ['过敏体质', '易打喷嚏流涕', '易起荨麻疹', '对药物食物花粉敏感', '季节性发作'],
    causes: '先天禀赋异常，遗传因素，过敏原刺激。',
    risks: '易患过敏性鼻炎、哮喘、荨麻疹、过敏性皮炎等。',
    advice: {
      diet: '饮食宜均衡，明确并远离过敏食物，多食新鲜蔬果增强免疫力。',
      lifestyle: '起居避免接触过敏原，保持环境清洁，季节交替注意防护。',
      exercise: '宜适度运动增强体质，避免在过敏原多的环境运动。',
      emotion: '保持平和心态，过敏发作时勿焦虑，积极配合调理。'
    },
    foodsGood: ['新鲜蔬果', '富含维C食物', '蜂蜜(确认不过敏)', '深海鱼', '酸奶'],
    foodsBad: ['已知过敏食物', '海鲜(过敏者)', '芒果', '花生(过敏者)', '加工食品']
  }
];

// 45 道题，每种体质 5 题
const QUESTIONS = [
  // 平和质 (5题，得分高表示偏平和)
  { id: 1, type: 'ph', text: '您精力充沛吗？' },
  { id: 2, type: 'ph', text: '您说话声音洪亮、中气十足吗？' },
  { id: 3, type: 'ph', text: '您情绪乐观、开朗吗？' },
  { id: 4, type: 'ph', text: '您睡得安稳，醒来精神好吗？' },
  { id: 5, type: 'ph', text: '您能适应外界环境的变化吗？' },
  // 气虚质 (5题)
  { id: 6, type: 'qx', text: '您容易疲乏无力吗？' },
  { id: 7, type: 'qx', text: '您容易气短，呼吸短促吗？' },
  { id: 8, type: 'qx', text: '您容易心慌吗？' },
  { id: 9, type: 'qx', text: '您说话声音低弱无力吗？' },
  { id: 10, type: 'qx', text: '您稍微活动就容易出虚汗吗？' },
  // 阳虚质 (5题)
  { id: 11, type: 'yx', text: '您手脚发凉吗？' },
  { id: 12, type: 'yx', text: '您胃脘部、背部或腰膝部怕冷吗？' },
  { id: 13, type: 'yx', text: '您比一般人更怕冷、衣服穿得更多吗？' },
  { id: 14, type: 'yx', text: '您吃凉东西容易拉肚子吗？' },
  { id: 15, type: 'yx', text: '您冬天尤其怕冷、夏天也不耐空调吗？' },
  // 阴虚质 (5题)
  { id: 16, type: 'yx2', text: '您感到手脚心发热吗？' },
  { id: 17, type: 'yx2', text: '您感觉身体或面部发热吗？' },
  { id: 18, type: 'yx2', text: '您口唇或皮肤干燥吗？' },
  { id: 19, type: 'yx2', text: '您口燥咽干、总想喝水吗？' },
  { id: 20, type: 'yx2', text: '您两颧部有潮红现象吗？' },
  // 痰湿质 (5题)
  { id: 21, type: 'ts', text: '您面部或鼻部常有油腻感吗？' },
  { id: 22, type: 'ts', text: '您感到胸闷或腹部胀满吗？' },
  { id: 23, type: 'ts', text: '您腹部肥满松软吗？' },
  { id: 24, type: 'ts', text: '您感觉喉中常有痰吗？' },
  { id: 25, type: 'ts', text: '您舌苔厚腻吗？' },
  // 湿热质 (5题)
  { id: 26, type: 'sr', text: '您感觉身体沉重困倦吗？' },
  { id: 27, type: 'sr', text: '您口中有异味（苦或臭）吗？' },
  { id: 28, type: 'sr', text: '您小便颜色偏黄或尿道有灼热感吗？' },
  { id: 29, type: 'sr', text: '您皮肤容易生痤疮或疖子吗？' },
  { id: 30, type: 'sr', text: '您大便黏腻不爽或气味臭秽吗？' },
  // 血瘀质 (5题)
  { id: 31, type: 'xy', text: '您皮肤在不知不觉中会出现青紫瘀斑吗？' },
  { id: 32, type: 'xy', text: '您两颧部有细微红丝（血丝）吗？' },
  { id: 33, type: 'xy', text: '您身体某处有固定疼痛吗？' },
  { id: 34, type: 'xy', text: '您面色晦暗或容易长褐斑吗？' },
  { id: 35, type: 'xy', text: '您容易有黑眼圈吗？' },
  // 气郁质 (5题)
  { id: 36, type: 'qy', text: '您感到闷闷不乐、情绪低落吗？' },
  { id: 37, type: 'qy', text: '您容易精神紧张、焦虑不安吗？' },
  { id: 38, type: 'qy', text: '您多愁善感、感情脆弱吗？' },
  { id: 39, type: 'qy', text: '您容易感到害怕或受惊吓吗？' },
  { id: 40, type: 'qy', text: '您经常叹气吗？' },
  // 特禀质 (5题)
  { id: 41, type: 'tb', text: '您没感冒时也会打喷嚏吗？' },
  { id: 42, type: 'tb', text: '您没感冒也会鼻塞、流鼻涕吗？' },
  { id: 43, type: 'tb', text: '您因季节交替、温度变化或异味会咳喘吗？' },
  { id: 44, type: 'tb', text: '您容易过敏（药物、食物、花粉等）吗？' },
  { id: 45, type: 'tb', text: '您皮肤容易起荨麻疹（风团）吗？' }
];

// 5 级评分选项
const OPTIONS = [
  { value: 1, label: '没有', desc: '从不' },
  { value: 2, label: '很少', desc: '偶尔' },
  { value: 3, label: '有时', desc: '一般' },
  { value: 4, label: '经常', desc: '较多' },
  { value: 5, label: '总是', desc: '一直' }
];

// 体质判定与计分工具
function calcScores(answers) {
  // answers: { questionId: value }
  const scores = {};
  CONSTITUTIONS.forEach(c => { scores[c.code] = { raw: 0, count: 0 }; });

  QUESTIONS.forEach(q => {
    const v = answers[q.id];
    if (v !== undefined && scores[q.type]) {
      scores[q.type].raw += v;
      scores[q.type].count += 1;
    }
  });

  // 转化分 = (原始分 - 条目数) / (条目数 * 4) * 100
  const results = CONSTITUTIONS.map(c => {
    const s = scores[c.code];
    const n = s.count;
    const raw = s.raw;
    const transform = n > 0 ? Math.round((raw - n) / (n * 4) * 100) : 0;
    let level = '否';
    if (c.code === 'ph') {
      // 平和质：高分倾向平和
      if (transform >= 60) level = '是';
      else if (transform >= 40) level = '倾向是';
      else level = '否';
    } else {
      // 偏颇体质：高分倾向该偏颇
      if (transform >= 60) level = '是';
      else if (transform >= 40) level = '倾向是';
      else level = '否';
    }
    return {
      code: c.code,
      name: c.name,
      color: c.color,
      icon: c.icon,
      raw: raw,
      count: n,
      transform: Math.max(0, transform),
      level: level
    };
  });

  // 判定主要体质类型
  // 若平和质为"是"且其他8种均"否" → 平和质
  // 否则取转化分最高的偏颇体质为主体质
  const ph = results.find(r => r.code === 'ph');
  const biased = results.filter(r => r.code !== 'ph');
  const biasedYes = biased.filter(r => r.level !== '否');

  let primary;
  if (ph.level === '是' && biasedYes.length === 0) {
    primary = ph;
  } else if (biasedYes.length > 0) {
    primary = biasedYes.reduce((a, b) => a.transform >= b.transform ? a : b);
  } else {
    // 都"否"时取最高分
    primary = results.reduce((a, b) => a.transform >= b.transform ? a : b);
  }

  return { all: results, primary };
}

// 全局暴露
window.CONSTITUTIONS = CONSTITUTIONS;
window.QUESTIONS = QUESTIONS;
window.OPTIONS = OPTIONS;
window.calcScores = calcScores;
