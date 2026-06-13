import { PrismaClient, QuestionType } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const questions = [
  // ===== 声调 (TONE) 难度1 =====
  {
    type: QuestionType.TONE,
    text: '妈',
    pinyin: 'mā (一声)',
    difficulty: 1,
    category: 'TONE',
    hint: '一声：平调，音调平稳',
    confusableWith: ['马(mǎ)', '骂(mà)', '麻(má)'],
  },
  {
    type: QuestionType.TONE,
    text: '马',
    pinyin: 'mǎ (三声)',
    difficulty: 1,
    category: 'TONE',
    hint: '三声：先降后升，像V字形',
    confusableWith: ['妈(mā)', '骂(mà)', '麻(má)'],
  },
  {
    type: QuestionType.TONE,
    text: '骂',
    pinyin: 'mà (四声)',
    difficulty: 1,
    category: 'TONE',
    hint: '四声：从高到低降调',
    confusableWith: ['妈(mā)', '马(mǎ)', '麻(má)'],
  },
  {
    type: QuestionType.TONE,
    text: '知',
    pinyin: 'zhī (一声)',
    difficulty: 1,
    category: 'TONE',
    hint: '一声平调',
    confusableWith: ['纸(zhǐ)', '志(zhì)', '直(zhí)'],
  },
  {
    type: QuestionType.TONE,
    text: '纸',
    pinyin: 'zhǐ (三声)',
    difficulty: 1,
    category: 'TONE',
    hint: '三声先降后升',
    confusableWith: ['知(zhī)', '志(zhì)', '直(zhí)'],
  },
  {
    type: QuestionType.TONE,
    text: '志',
    pinyin: 'zhì (四声)',
    difficulty: 1,
    category: 'TONE',
    hint: '四声降调',
    confusableWith: ['知(zhī)', '纸(zhǐ)', '直(zhí)'],
  },
  {
    type: QuestionType.TONE,
    text: '书',
    pinyin: 'shū (一声)',
    difficulty: 1,
    category: 'TONE',
    hint: '一声平调',
    confusableWith: ['鼠(shǔ)', '树(shù)', '熟(shú)'],
  },
  {
    type: QuestionType.TONE,
    text: '鼠',
    pinyin: 'shǔ (三声)',
    difficulty: 1,
    category: 'TONE',
    hint: '三声先降后升',
    confusableWith: ['书(shū)', '树(shù)', '熟(shú)'],
  },

  // ===== 平翘舌 (INITIAL) 难度2 =====
  {
    type: QuestionType.INITIAL,
    text: '在',
    pinyin: 'zài',
    difficulty: 2,
    category: 'INITIAL',
    hint: 'z 是平舌音，舌尖抵下齿',
    confusableWith: ['斋(zhāi)', '债(zhài)'],
  },
  {
    type: QuestionType.INITIAL,
    text: '斋',
    pinyin: 'zhāi',
    difficulty: 2,
    category: 'INITIAL',
    hint: 'zh 是翘舌音，舌尖上翘',
    confusableWith: ['在(zài)', '摘(zhāi)'],
  },
  {
    type: QuestionType.INITIAL,
    text: '造',
    pinyin: 'zào',
    difficulty: 2,
    category: 'INITIAL',
    hint: 'z 是平舌音',
    confusableWith: ['找(zhǎo)', '早(zǎo)'],
  },
  {
    type: QuestionType.INITIAL,
    text: '找',
    pinyin: 'zhǎo',
    difficulty: 2,
    category: 'INITIAL',
    hint: 'zh 是翘舌音',
    confusableWith: ['造(zào)', '早(zǎo)'],
  },
  {
    type: QuestionType.INITIAL,
    text: '三',
    pinyin: 'sān',
    difficulty: 2,
    category: 'INITIAL',
    hint: 's 是平舌音',
    confusableWith: ['山(shān)', '闪(shǎn)'],
  },
  {
    type: QuestionType.INITIAL,
    text: '山',
    pinyin: 'shān',
    difficulty: 2,
    category: 'INITIAL',
    hint: 'sh 是翘舌音',
    confusableWith: ['三(sān)', '删(shān)'],
  },
  {
    type: QuestionType.INITIAL,
    text: '四',
    pinyin: 'sì',
    difficulty: 2,
    category: 'INITIAL',
    hint: 's 是平舌音',
    confusableWith: ['是(shì)', '式(shì)'],
  },
  {
    type: QuestionType.INITIAL,
    text: '是',
    pinyin: 'shì',
    difficulty: 2,
    category: 'INITIAL',
    hint: 'sh 是翘舌音',
    confusableWith: ['四(sì)', '事(shì)'],
  },
  {
    type: QuestionType.INITIAL,
    text: '才',
    pinyin: 'cái',
    difficulty: 2,
    category: 'INITIAL',
    hint: 'c 是平舌音',
    confusableWith: ['柴(chái)', '差(chā)'],
  },
  {
    type: QuestionType.INITIAL,
    text: '柴',
    pinyin: 'chái',
    difficulty: 2,
    category: 'INITIAL',
    hint: 'ch 是翘舌音',
    confusableWith: ['才(cái)', '拆(chāi)'],
  },

  // ===== 前后鼻音 (FINAL) 难度2 =====
  {
    type: QuestionType.FINAL,
    text: '音',
    pinyin: 'yīn',
    difficulty: 2,
    category: 'FINAL',
    hint: 'in 是前鼻音，鼻音在前',
    confusableWith: ['英(yīng)', '因(yīn)'],
  },
  {
    type: QuestionType.FINAL,
    text: '英',
    pinyin: 'yīng',
    difficulty: 2,
    category: 'FINAL',
    hint: 'ing 是后鼻音，软腭鼻音',
    confusableWith: ['音(yīn)', '应(yīng)'],
  },
  {
    type: QuestionType.FINAL,
    text: '金',
    pinyin: 'jīn',
    difficulty: 2,
    category: 'FINAL',
    hint: 'in 是前鼻音',
    confusableWith: ['京(jīng)', '今(jīn)'],
  },
  {
    type: QuestionType.FINAL,
    text: '京',
    pinyin: 'jīng',
    difficulty: 2,
    category: 'FINAL',
    hint: 'ing 是后鼻音',
    confusableWith: ['金(jīn)', '经(jīng)'],
  },
  {
    type: QuestionType.FINAL,
    text: '安',
    pinyin: 'ān',
    difficulty: 2,
    category: 'FINAL',
    hint: 'an 是前鼻音',
    confusableWith: ['昂(áng)', '岸(àn)'],
  },
  {
    type: QuestionType.FINAL,
    text: '昂',
    pinyin: 'áng',
    difficulty: 2,
    category: 'FINAL',
    hint: 'ang 是后鼻音',
    confusableWith: ['安(ān)', '暗(àn)'],
  },
  {
    type: QuestionType.FINAL,
    text: '看',
    pinyin: 'kàn',
    difficulty: 2,
    category: 'FINAL',
    hint: 'an 是前鼻音',
    confusableWith: ['康(kāng)', '砍(kǎn)'],
  },
  {
    type: QuestionType.FINAL,
    text: '康',
    pinyin: 'kāng',
    difficulty: 2,
    category: 'FINAL',
    hint: 'ang 是后鼻音',
    confusableWith: ['看(kàn)', '抗(kàng)'],
  },

  // ===== l/n 混淆 (INITIAL) 难度3 =====
  {
    type: QuestionType.INITIAL,
    text: '牛',
    pinyin: 'niú',
    difficulty: 3,
    category: 'LN',
    hint: 'n 发音时舌尖抵上齿龈',
    confusableWith: ['留(liú)', '流(liú)'],
  },
  {
    type: QuestionType.INITIAL,
    text: '留',
    pinyin: 'liú',
    difficulty: 3,
    category: 'LN',
    hint: 'l 发音时舌尖抵上齿龈但气流从两侧流出',
    confusableWith: ['牛(niú)', '流(liú)'],
  },
  {
    type: QuestionType.INITIAL,
    text: '年',
    pinyin: 'nián',
    difficulty: 3,
    category: 'LN',
    hint: 'n 声母，鼻音',
    confusableWith: ['连(lián)', '炼(liàn)'],
  },
  {
    type: QuestionType.INITIAL,
    text: '连',
    pinyin: 'lián',
    difficulty: 3,
    category: 'LN',
    hint: 'l 声母，边音',
    confusableWith: ['年(nián)', '炼(liàn)'],
  },
  {
    type: QuestionType.INITIAL,
    text: '脑',
    pinyin: 'nǎo',
    difficulty: 3,
    category: 'LN',
    hint: 'n 声母，鼻音',
    confusableWith: ['老(lǎo)', '劳(láo)'],
  },
  {
    type: QuestionType.INITIAL,
    text: '老',
    pinyin: 'lǎo',
    difficulty: 3,
    category: 'LN',
    hint: 'l 声母，边音',
    confusableWith: ['脑(nǎo)', '劳(láo)'],
  },

  // ===== 综合 (MIXED) 难度3-4 =====
  {
    type: QuestionType.MIXED,
    text: '生',
    pinyin: 'shēng',
    difficulty: 3,
    category: 'MIXED',
    hint: 'sh 翘舌 + eng 后鼻音',
    confusableWith: ['声(shēng)', '僧(sēng)', '升(shēng)'],
  },
  {
    type: QuestionType.MIXED,
    text: '正',
    pinyin: 'zhèng',
    difficulty: 3,
    category: 'MIXED',
    hint: 'zh 翘舌 + eng 后鼻音',
    confusableWith: ['争(zhēng)', '增(zēng)', '层(céng)'],
  },
  {
    type: QuestionType.MIXED,
    text: '人',
    pinyin: 'rén',
    difficulty: 3,
    category: 'MIXED',
    hint: 'r 声母，独特发音',
    confusableWith: ['仁(rén)', '嫩(nèn)', '林(lín)'],
  },
  {
    type: QuestionType.MIXED,
    text: '绿',
    pinyin: 'lǜ',
    difficulty: 3,
    category: 'MIXED',
    hint: 'l + ü 韵母',
    confusableWith: ['女(nǚ)', '旅(lǚ)', '律(lǜ)'],
  },
  {
    type: QuestionType.MIXED,
    text: '学',
    pinyin: 'xué',
    difficulty: 4,
    category: 'MIXED',
    hint: 'x 声母 + üe 韵母',
    confusableWith: ['雪(xuě)', '靴(xuē)', '穴(xué)'],
  },
  {
    type: QuestionType.MIXED,
    text: '去',
    pinyin: 'qù',
    difficulty: 4,
    category: 'MIXED',
    hint: 'q 声母 + ü 韵母',
    confusableWith: ['趣(qù)', '曲(qǔ)', '区(qū)'],
  },

  // ===== 高难度 (MIXED) 难度4-5 =====
  {
    type: QuestionType.MIXED,
    text: '自行车',
    pinyin: 'zì xíng chē',
    difficulty: 4,
    category: 'MIXED',
    hint: 'z 平舌 + ch 翘舌，注意区分',
    confusableWith: ['自行车(zì xíng chē)'],
  },
  {
    type: QuestionType.MIXED,
    text: '认真',
    pinyin: 'rèn zhēn',
    difficulty: 4,
    category: 'MIXED',
    hint: 'r 和 zh 都是翘舌相关音',
    confusableWith: ['任真', '仁珍'],
  },
  {
    type: QuestionType.MIXED,
    text: '春天',
    pinyin: 'chūn tiān',
    difficulty: 4,
    category: 'MIXED',
    hint: 'ch 翘舌 + un 前鼻音',
    confusableWith: ['村田', '存天'],
  },
  {
    type: QuestionType.MIXED,
    text: '北京',
    pinyin: 'běi jīng',
    difficulty: 5,
    category: 'MIXED',
    hint: 'j + ing 后鼻音',
    confusableWith: ['背景(bèi jǐng)', '贝京'],
  },
  {
    type: QuestionType.MIXED,
    text: '中国',
    pinyin: 'zhōng guó',
    difficulty: 5,
    category: 'MIXED',
    hint: 'zh 翘舌 + ong 后鼻音',
    confusableWith: ['总国', '宗国'],
  },
  {
    type: QuestionType.MIXED,
    text: '普通话',
    pinyin: 'pǔ tōng huà',
    difficulty: 5,
    category: 'MIXED',
    hint: '注意 ong 后鼻音',
    confusableWith: ['扑通话', '布通话'],
  },
  {
    type: QuestionType.MIXED,
    text: '音乐',
    pinyin: 'yīn yuè',
    difficulty: 5,
    category: 'MIXED',
    hint: 'in 前鼻音 + üe 韵母',
    confusableWith: ['应乐(yīng yuè)', '因乐'],
  },
  {
    type: QuestionType.MIXED,
    text: '语言',
    pinyin: 'yǔ yán',
    difficulty: 5,
    category: 'MIXED',
    hint: 'ü 韵母 + an 前鼻音',
    confusableWith: ['玉言', '愚言'],
  },
]

const achievements = [
  { name: '初学者', description: '完成第一关', icon: '🎯', conditionType: 'LEVEL', conditionValue: 1 },
  { name: '连击达人', description: '连续7天登录', icon: '🔥', conditionType: 'STREAK', conditionValue: 7 },
  { name: '满分选手', description: '单关获得满分', icon: '⭐', conditionType: 'PERFECT', conditionValue: 1 },
  { name: '纠音大师', description: '累计正确1000题', icon: '🏆', conditionType: 'COUNT', conditionValue: 1000 },
  { name: '挑战者', description: '完成最高难度关卡', icon: '💎', conditionType: 'LEVEL', conditionValue: 6 },
  { name: '三日连击', description: '连续3天登录', icon: '✨', conditionType: 'STREAK', conditionValue: 3 },
  { name: '月度坚持', description: '连续30天登录', icon: '🌙', conditionType: 'STREAK', conditionValue: 30 },
  { name: '百题达人', description: '累计正确100题', icon: '💯', conditionType: 'COUNT', conditionValue: 100 },
]

async function main() {
  console.log('🌱 开始播种数据库...')

  // 清空旧数据
  await prisma.userAchievement.deleteMany()
  await prisma.errorBook.deleteMany()
  await prisma.gameSession.deleteMany()
  await prisma.progress.deleteMany()
  await prisma.achievement.deleteMany()
  await prisma.question.deleteMany()
  await prisma.user.deleteMany()

  // 插入题目
  for (const q of questions) {
    await prisma.question.create({
      data: {
        ...q,
        confusableWith: q.confusableWith,
      },
    })
  }
  console.log(`✅ 插入 ${questions.length} 道题目`)

  // 插入成就
  for (const a of achievements) {
    await prisma.achievement.create({ data: a })
  }
  console.log(`✅ 插入 ${achievements.length} 个成就`)

  // 创建演示用户
  const hashedPassword = await bcrypt.hash('demo123456', 10)
  const demoUser = await prisma.user.create({
    data: {
      username: 'demo',
      email: 'demo@mandarin.game',
      password: hashedPassword,
      streakDays: 3,
      totalScore: 150,
      level: 2,
    },
  })

  await prisma.progress.create({
    data: {
      userId: demoUser.id,
      currentLevel: 2,
      currentDifficulty: 2,
      totalCorrect: 15,
      totalAttempts: 20,
      accuracy: 75,
    },
  })

  console.log(`✅ 创建演示用户 demo@mandarin.game / demo123456`)
  console.log('🎉 数据库初始化完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
