import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Default user ID for the main account
const DEFAULT_USER_ID = 'main-account-user-id'

const withExtendedComposition = (aliment: {
  ms_percentage: number
  ufl_per_kg_ms: number
  pdie_per_kg_ms: number
  pdin_per_kg_ms: number
  ndf_per_kg_ms: number
}) => ({
  mo_percentage: Math.max(0, Math.round((100 - (aliment.ms_percentage * 0.12)) * 10) / 10),
  mat_percentage: Math.max(0, Math.round((aliment.pdin_per_kg_ms / 10) * 10) / 10),
  ee_percentage: 2.5,
  amidon_percentage: 18,
  cb_percentage: Math.max(0, Math.round((aliment.ndf_per_kg_ms * 0.65) * 10) / 10),
  ndf_percentage_brut: aliment.ndf_per_kg_ms,
  adf_percentage: Math.max(0, Math.round((aliment.ndf_per_kg_ms * 0.75) * 10) / 10),
  adl_percentage: Math.max(0, Math.round((aliment.ndf_per_kg_ms * 0.15) * 10) / 10),
  mm_percentage: Math.max(0, Math.round((100 - (100 - (aliment.ms_percentage * 0.12))) * 10) / 10),
  ca_g_per_kg_brut: 6,
  p_g_per_kg_brut: 3.5,
  na_g_per_kg_brut: 1.5,
  cl_g_per_kg_brut: 2,
  ufl_per_kg_brut: Math.round((aliment.ufl_per_kg_ms * (aliment.ms_percentage / 100)) * 100) / 100,
  energie_nette_kcal_per_kg: Math.round(aliment.ufl_per_kg_ms * 1700),
  ufv_per_kg_brut: Math.round((aliment.ufl_per_kg_ms * 0.95) * 100) / 100,
  uel_brut: 1,
  ueb_brut: 1,
  pdie_g_per_kg_brut: Math.round(aliment.pdie_per_kg_ms * (aliment.ms_percentage / 100)),
  pdin_g_per_kg_brut: Math.round(aliment.pdin_per_kg_ms * (aliment.ms_percentage / 100)),
  emv_kcal_per_kg_brut: Math.round(aliment.ufl_per_kg_ms * 2500),
  ed_lapins_kcal_per_kg_brut: Math.round(aliment.ufl_per_kg_ms * 2100),
  lys_percentage: 0.8,
  meth_percentage: 0.25,
  cys_percentage: 0.22,
  thr_percentage: 0.55,
  phenols_totaux: 0,
  flavonoides_totaux: 0,
  tannins_totaux: 0,
  tannins_condenses: 0,
})

async function main() {
  console.log('🌱 Starting seed...')

  // Create the default main account user
  console.log('Creating default main account user...')
  await prisma.user.upsert({
    where: { id: DEFAULT_USER_ID },
    update: {},
    create: {
      id: DEFAULT_USER_ID,
      email: 'main@account.local',
      name: 'Compte Principal',
      phone: '+216 00 000 000',
      exploitantName: 'Exploitation Principale',
      gouvernorat: 'Tunis',
      animalCount: 0,
    },
  })
  console.log('✅ Default user created')

  // Seed Aliments (Feed ingredients)
  const aliments = [
    // Fourrages grossiers (Roughage)
    {
      name_fr: "Paille d'orge",
      name_ar: "قش الشعير",
      category_fr: "Fourrage grossier",
      category_ar: "علف خشن",
      ms_percentage: 85.0,
      ufl_per_kg_ms: 0.42,
      pdie_per_kg_ms: 25,
      pdin_per_kg_ms: 30,
      ndf_per_kg_ms: 75.0,
      isPublic: true
    },
    {
      name_fr: "Paille de blé",
      name_ar: "قش القمح",
      category_fr: "Fourrage grossier",
      category_ar: "علف خشن",
      ms_percentage: 86.0,
      ufl_per_kg_ms: 0.38,
      pdie_per_kg_ms: 22,
      pdin_per_kg_ms: 28,
      ndf_per_kg_ms: 78.0,
      isPublic: true
    },
    {
      name_fr: "Foin de luzerne",
      name_ar: "تبن البرسيم الحجازي",
      category_fr: "Fourrage grossier",
      category_ar: "علف خشن",
      ms_percentage: 88.0,
      ufl_per_kg_ms: 0.68,
      pdie_per_kg_ms: 95,
      pdin_per_kg_ms: 110,
      ndf_per_kg_ms: 45.0,
      isPublic: true
    },
    {
      name_fr: "Foin d'avoine",
      name_ar: "تبن الشوفان",
      category_fr: "Fourrage grossier",
      category_ar: "علف خشن",
      ms_percentage: 85.0,
      ufl_per_kg_ms: 0.58,
      pdie_per_kg_ms: 65,
      pdin_per_kg_ms: 75,
      ndf_per_kg_ms: 58.0,
      isPublic: true
    },
    {
      name_fr: "Ensilage de maïs",
      name_ar: "سيلاج الذرة",
      category_fr: "Fourrage grossier",
      category_ar: "علف خشن",
      ms_percentage: 32.0,
      ufl_per_kg_ms: 0.85,
      pdie_per_kg_ms: 68,
      pdin_per_kg_ms: 75,
      ndf_per_kg_ms: 42.0,
      isPublic: true
    },
    
    // Verdure (Green feed)
    {
      name_fr: "Luzerne verte",
      name_ar: "البرسيم الحجازي الأخضر",
      category_fr: "Verdure",
      category_ar: "علف أخضر",
      ms_percentage: 22.0,
      ufl_per_kg_ms: 0.72,
      pdie_per_kg_ms: 105,
      pdin_per_kg_ms: 120,
      ndf_per_kg_ms: 40.0,
      isPublic: true
    },
    {
      name_fr: "Trèfle violet",
      name_ar: "البرسيم البنفسجي",
      category_fr: "Verdure",
      category_ar: "علف أخضر",
      ms_percentage: 18.0,
      ufl_per_kg_ms: 0.70,
      pdie_per_kg_ms: 95,
      pdin_per_kg_ms: 110,
      ndf_per_kg_ms: 38.0,
      isPublic: true
    },
    {
      name_fr: "Ray-grass anglais",
      name_ar: "عشب الراي الإنجليزي",
      category_fr: "Verdure",
      category_ar: "علف أخضر",
      ms_percentage: 20.0,
      ufl_per_kg_ms: 0.75,
      pdie_per_kg_ms: 85,
      pdin_per_kg_ms: 95,
      ndf_per_kg_ms: 45.0,
      isPublic: true
    },
    {
      name_fr: "Avoine verte",
      name_ar: "الشوفان الأخضر",
      category_fr: "Verdure",
      category_ar: "علف أخضر",
      ms_percentage: 25.0,
      ufl_per_kg_ms: 0.68,
      pdie_per_kg_ms: 70,
      pdin_per_kg_ms: 80,
      ndf_per_kg_ms: 50.0,
      isPublic: true
    },
    
    // Concentrés (Concentrates)
    {
      name_fr: "Orge",
      name_ar: "الشعير",
      category_fr: "Concentré",
      category_ar: "علف مركز",
      ms_percentage: 88.0,
      ufl_per_kg_ms: 1.05,
      pdie_per_kg_ms: 78,
      pdin_per_kg_ms: 85,
      ndf_per_kg_ms: 18.0,
      isPublic: true
    },
    {
      name_fr: "Maïs grain",
      name_ar: "حبوب الذرة",
      category_fr: "Concentré",
      category_ar: "علف مركز",
      ms_percentage: 86.0,
      ufl_per_kg_ms: 1.12,
      pdie_per_kg_ms: 65,
      pdin_per_kg_ms: 70,
      ndf_per_kg_ms: 12.0,
      isPublic: true
    },
    {
      name_fr: "Son de blé",
      name_ar: "نخالة القمح",
      category_fr: "Concentré",
      category_ar: "علف مركز",
      ms_percentage: 87.0,
      ufl_per_kg_ms: 0.72,
      pdie_per_kg_ms: 110,
      pdin_per_kg_ms: 125,
      ndf_per_kg_ms: 42.0,
      isPublic: true
    },
    {
      name_fr: "Tourteau de soja",
      name_ar: "كسب فول الصويا",
      category_fr: "Concentré",
      category_ar: "علف مركز",
      ms_percentage: 88.0,
      ufl_per_kg_ms: 1.15,
      pdie_per_kg_ms: 320,
      pdin_per_kg_ms: 350,
      ndf_per_kg_ms: 15.0,
      isPublic: true
    },
    {
      name_fr: "Tourteau de tournesol",
      name_ar: "كسب عباد الشمس",
      category_fr: "Concentré",
      category_ar: "علف مركز",
      ms_percentage: 89.0,
      ufl_per_kg_ms: 0.95,
      pdie_per_kg_ms: 250,
      pdin_per_kg_ms: 280,
      ndf_per_kg_ms: 28.0,
      isPublic: true
    },
    {
      name_fr: "Pulpe de betterave",
      name_ar: "لب البنجر",
      category_fr: "Concentré",
      category_ar: "علف مركز",
      ms_percentage: 20.0,
      ufl_per_kg_ms: 0.85,
      pdie_per_kg_ms: 58,
      pdin_per_kg_ms: 65,
      ndf_per_kg_ms: 22.0,
      isPublic: true
    },
    
    // Correcteurs (Correctors/Supplements)
    {
      name_fr: "CMV laitier",
      name_ar: "مكمل فيتامينات ومعادن للحلوب",
      category_fr: "Correcteur",
      category_ar: "مكمل غذائي",
      ms_percentage: 95.0,
      ufl_per_kg_ms: 0.60,
      pdie_per_kg_ms: 180,
      pdin_per_kg_ms: 200,
      ndf_per_kg_ms: 8.0,
      isPublic: true
    },
    {
      name_fr: "Urée",
      name_ar: "اليوريا",
      category_fr: "Correcteur",
      category_ar: "مكمل غذائي",
      ms_percentage: 99.0,
      ufl_per_kg_ms: 0.0,
      pdie_per_kg_ms: 0,
      pdin_per_kg_ms: 2800,
      ndf_per_kg_ms: 0.0,
      isPublic: true
    },
    {
      name_fr: "Bicarbonate de sodium",
      name_ar: "بيكربونات الصوديوم",
      category_fr: "Correcteur",
      category_ar: "مكمل غذائي",
      ms_percentage: 100.0,
      ufl_per_kg_ms: 0.0,
      pdie_per_kg_ms: 0,
      pdin_per_kg_ms: 0,
      ndf_per_kg_ms: 0.0,
      isPublic: true
    }
  ]

  // Insert aliments (idempotent)
  for (const aliment of aliments) {
    const existing = await prisma.aliment.findFirst({
      where: {
        name_fr: aliment.name_fr,
        isPublic: true,
        userId: null,
      }
    })

    if (existing) {
      await prisma.aliment.update({
        where: { id: existing.id },
        data: {
          ...aliment,
          ...withExtendedComposition(aliment),
        }
      })
    } else {
      await prisma.aliment.create({
        data: {
          ...aliment,
          ...withExtendedComposition(aliment),
        }
      })
    }
  }

  console.log(`✅ Created ${aliments.length} aliments`)

  // Seed Daily Tips
  const dailyTips = [
    {
      title_fr: "Importance de l'eau fraîche",
      title_ar: "أهمية الماء العذب",
      content_fr: "Assurez-vous que vos animaux ont accès à de l'eau fraîche et propre en permanence. Une vache laitière peut boire jusqu'à 100-150 litres d'eau par jour en période de forte chaleur. L'eau doit être renouvelée régulièrement et les abreuvoirs nettoyés.",
      content_ar: "تأكد من أن حيواناتك لديها إمكانية الوصول إلى الماء العذب والنظيف باستمرار. يمكن للبقرة الحلوب أن تشرب ما يصل إلى 100-150 لترًا من الماء يوميًا في فترات الحر الشديد. يجب تجديد الماء بانتظام وتنظيف أحواض الشرب.",
      category: "Bien-être"
    },
    {
      title_fr: "Gestion du stress thermique",
      title_ar: "إدارة الإجهاد الحراري",
      content_fr: "En période de forte chaleur (THI > 68), réduisez l'activité des animaux pendant les heures les plus chaudes (11h-16h). Augmentez la ventilation, fournissez de l'ombre et adaptez les horaires de traite. Surveillez les signes de stress : halètement, salive excessive, réduction de l'appétit.",
      content_ar: "في فترات الحر الشديد (مؤشر الحرارة والرطوبة > 68)، قلل من نشاط الحيوانات خلال الساعات الأكثر حرارة (11 صباحًا - 4 مساءً). زد التهوية، وفر الظل وعدل مواعيد الحلب. راقب علامات الإجهاد: اللهاث، اللعاب المفرط، انخفاض الشهية.",
      category: "Santé"
    },
    {
      title_fr: "Transition alimentaire progressive",
      title_ar: "الانتقال الغذائي التدريجي",
      content_fr: "Lors d'un changement d'alimentation, effectuez toujours une transition progressive sur 7-10 jours. Commencez par remplacer 10-20% de l'ancien aliment par le nouveau, puis augmentez progressivement. Cela permet d'éviter les troubles digestifs et l'acidose.",
      content_ar: "عند تغيير النظام الغذائي، قم دائمًا بالانتقال التدريجي على مدى 7-10 أيام. ابدأ بتبديل 10-20% من العلف القديم بالجديد، ثم زد تدريجيًا. هذا يساعد على تجنب اضطرابات الهضم والحموضة.",
      category: "Alimentation"
    },
    {
      title_fr: "Surveillance de la rumination",
      title_ar: "مراقبة الاجترار",
      content_fr: "Une vache en bonne santé rumine 6-8 heures par jour, avec 400-600 mouvements de mâchoire par bole. Surveillez la diminution de la rumination qui peut indiquer un problème de santé, une acidose ou un stress. Les périodes de rumination se font principalement au repos.",
      content_ar: "البقرة السليمة تجتر 6-8 ساعات يوميًا، بحركات مضغ 400-600 لكل بلعة. راقب انخفاض الاجترار الذي قد يشير إلى مشكلة صحية أو حموضة أو إجهاد. فترات الاجترار تحدث بشكل أساسي أثناء الراحة.",
      category: "Santé"
    },
    {
      title_fr: "Optimisation de la fibre dans la ration",
      title_ar: "تحسين الألياف في الحصة الغذائية",
      content_fr: "Maintenez un taux de NDF (fibres neutres détergentes) entre 28-35% de la matière sèche totale pour éviter l'acidose. Les fibres longues (>4cm) doivent représenter au moins 15% de la MS. Privilégiez les fourrages de qualité pour stimuler la rumination.",
      content_ar: "حافظ على نسبة الألياف المحايدة المنظفة بين 28-35% من إجمالي المادة الجافة لتجنب الحموضة. يجب أن تمثل الألياف الطويلة (>4 سم) ما لا يقل عن 15% من المادة الجافة. اعطِ الأولوية للأعلاف عالية الجودة لتحفيز الاجترار.",
      category: "Alimentation"
    },
    {
      title_fr: "Prévention des maladies métaboliques",
      title_ar: "الوقاية من الأمراض الأيضية",
      content_fr: "En période de vêlage, surveillez particulièrement les signes de fièvre de lait (hypocalcémie), cétose et acidose. Assurez une transition alimentaire douce 3 semaines avant le vêlage. Limitez les concentrés riches en énergie en début de lactation.",
      content_ar: "في فترة الولادة، راقب بشكل خاص علامات حمى اللبن (نقص الكالسيوم)، الكيتوز والحموضة. تأكد من انتقال غذائي سلس قبل 3 أسابيع من الولادة. اقلل المركزات الغنية بالطاقة في بداية فترة الحلابة.",
      category: "Santé"
    },
    {
      title_fr: "Gestion des pâturages",
      title_ar: "إدارة المراعي",
      content_fr: "Effectuez une rotation des pâturages pour maintenir leur qualité. Laissez l'herbe atteindre 15-20cm avant la mise au pâturage et ne descendez pas en dessous de 5cm. Évitez le surpâturage qui dégrade la prairie et réduit la valeur nutritive.",
      content_ar: "قم بتدوير المراعي للحفاظ على جودتها. اترك العشب يصل إلى 15-20 سم قبل الرعي ولا تنزل تحت 5 سم. تجنب الرعي المفرط الذي يدهور المرعى ويقلل القيمة الغذائية.",
      category: "Alimentation"
    },
    {
      title_fr: "Hygiène de la traite",
      title_ar: "نظافة الحلب",
      content_fr: "Nettoyez et désinfectez les trayons avant et après chaque traite. Utilisez des lavettes individuelles pour chaque animal. Contrôlez régulièrement la machine à traire et vérifiez le niveau de vide. Une bonne hygiène prévient les mammites.",
      content_ar: "نظف وطهر الحلمات قبل وبعد كل حلبة. استخدم مناشف فردية لكل حيوان. تحكم بانتظام في آلة الحلب وتحقق من مستوى الفراغ. النظافة الجيدة تمنع التهاب الضرع.",
      category: "Santé"
    }
  ]

  // Insert daily tips (idempotent)
  for (const tip of dailyTips) {
    const existingTip = await prisma.dailyTip.findFirst({
      where: {
        title_fr: tip.title_fr,
      }
    })

    if (existingTip) {
      await prisma.dailyTip.update({
        where: { id: existingTip.id },
        data: tip,
      })
    } else {
      await prisma.dailyTip.create({
        data: tip
      })
    }
  }

  console.log(`✅ Created ${dailyTips.length} daily tips`)
  console.log('🌱 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })