import { logNtfy } from './main.js';

// 1. n8n Node Mock Data
const n8nNodesData = [
  { id: 'transcript', name: '1. Lead Girişi', icon: '📥', title: 'Webhook: Yeni Müşteri Adayı', json: { node: 'Webhook: B2B Lead Kanalı', status: 'completed', source: 'WhatsApp / Web Chat', client: 'Avrupa Klinik Malzemeleri Tedarikçisi', contact: 'Hakan Korkmaz', quantity_requested: 50 } },
  { id: 'extraction', name: '2. Talep Çıkarımı', icon: '🔍', title: 'Hermes AI: Talep Analizi', json: { node: 'Nous Hermes AI Extraction', status: 'completed', parameters: ['Hasta Karyolası', 'Havalı Yatak', 'Teklif İndirimi', 'Hızlı Teslimat'], confidence_score: 0.98 } },
  { id: 'json', name: '3. Standardizasyon', icon: '💻', title: 'Formatter: JSON Veri Standardı', json: { node: 'JSON Standardizer Node', status: 'completed', payload: { client_name: 'Avrupa Klinik Medikal', solution_type: 'HMPLAS Motorlu Karyola', units: 50, estimated_deal_eur: 180000 } } },
  { id: 'synthesis', name: '4. Teklif Üretici', icon: '📄', title: 'DocGen: Otomatik Teklif Dokümanı', json: { node: 'Google Docs Synthesis Engine', status: 'completed', variables_injected: { '{{customer_name}}': 'Avrupa Klinik Medikal', '{{quantity}}': '50 Adet Karyola ve Seti', '{{unit_price}}': '€2,880 (İndirimli)', '{{total_price}}': '€144,000' }, output_doc_id: 'gdrive://proposals/draft_proposal_50units.docx' } },
  { id: 'dispatch', name: '5. PDF Gönderim', icon: '✉️', title: 'Mailer: Teklif PDF Dağıtım', json: { node: 'PDF Dispatch & Notification Gateway', status: 'completed', pdf_url: 'gdrive://proposals/final/HMPLAS_Sales_Proposal.pdf', delivery_logs: [{ channel: 'Gmail', to: 'info@avrupaklinik.com', status: 'sent' }, { channel: 'Telegram Bot API', group: 'Sales Swarm Group', status: 'dispatched' }, { channel: 'ntfy Push Gateway', topic: 'hmplasos-alerts', status: 'pushed' }] } }
];

// 2. B2B Social Post database
const socialPosts = {
  en: {
    product: "📢 HMPLAS B2B Supply Portal: Bed and Medical Equipment Direct from Manufacturer!\n\nDiscover our Pro and Comfort series electric beds and medical accessories, available for wholesale with direct factory pricing and fast global shipping.\n\n👉 Inquire for wholesale catalog: sales@hmplas.com\n\n#MedicalWholesale #ElectricBeds #HospitalSupplies #B2B",
    leadgen: "🤖 Scale Your Sales with Autonomous AI Assistants!\n\nInteract with AI agents that answer client queries in seconds, generate automatic draft proposals, and book calendar meetings. 24/7 client communication with high conversion rates.\n\n📩 Request a demo: sales@hmplas.com\n\n#AISales #ArtificialIntelligence #SalesAutomation #LeadGen",
    automation: "🔗 End-to-End Marketing Automation with n8n & Hermes Agent OS!\n\nAutomate your entire flow from social media content scheduling to lead qualification, draft proposal generation, and real-time CRM updates.\n\n✉️ Learn about our integrations: sales@hmplas.com\n\n#MarketingAutomation #n8n #HermesOS #Workflows",
    campaign: "📈 B2B Campaign Management: Maximum ROI, Minimum Overhead.\n\nManage your ad budgets effectively with the Hermes Agent OS campaign intelligence simulator. Track lead volumes, conversion rates, and net revenue outputs in real time.\n\n📲 Download case study: sales@hmplas.com\n\n#AdManagement #ROI #B2BMarketing #Analytics"
  },
  fr: {
    product: "📢 HMPLAS Portail B2B : Lits et équipements médicaux directement du fabricant !\n\nDécouvrez nos séries de lits électriques Pro et Comfort pour professionnels, disponibles à la vente en gros avec des tarifs directs d'usine et livraison rapide.\n\n👉 Demandez le catalogue de gros : sales@hmplas.com\n\n#GrossisteMedical #LitElectrique #EquipementB2B",
    leadgen: "🤖 Augmentez vos ventes grâce aux assistants IA autonomes !\n\nCollaborez avec des agents IA qui répondent aux clients en quelques secondes, préparent des propositions de prix automatiquement et gèrent votre calendrier.\n\n📩 Obtenez une démonstration : sales@hmplas.com\n\n#VenteIA #Automatisation #LeadGeneration #AgentIA",
    automation: "🔗 Automatisation complète du marketing avec n8n & Hermes Agent OS !\n\nDe la création de posts sur les réseaux sociaux au suivi des leads qualifiés, automatisez l'ensemble de vos processus de marketing numérique.\n\n✉️ Contactez nos ingénieurs : sales@hmplas.com\n\n#Automation #n8n #HermesOS #Productivite",
    campaign: "📈 Gestion de campagne B2B : ROI maximal, gestion simplifiée.\n\nOptimisez vos budgets publicitaires grâce au simulateur d'intelligence marketing Hermes Agent OS. Mesurez instantanément le nombre de prospects et le chiffre d'affaires généré.\n\n📲 Télécharger le rapport complet : sales@hmplas.com\n\n#MarketingB2B #ROI #GestionPublicitaire #Medtech"
  },
  it: {
    product: "📢 Portale di fornitura B2B HMPLAS: Letti ospedalieri ed attrezzature mediche direttamente dal produttore!\n\nOffriamo i nostri letti motorizzati professionali delle serie Pro e Comfort, con vantaggi di vendita all'ingrosso direttamente dalla fabbrica. Struttura motore durevole, design ergonomico e garanzia di consegna rapida.\n\n👉 Per listino prezzi all'ingrosso: sales@hmplas.com\n\n#AttrezzatureMediche #LettiOspedalieri #B2B #FornitureMediche",
    leadgen: "🤖 Espandi le tue vendite con gli assistenti AI autonomi!\n\nIncontra gli assistenti AI HMPLAS che rispondono alle domande dei clienti in pochi secondi, preparano preventivi bozza automatici e gestiscono il tuo calendario. Comunicazione clienti 24/7 con alti tassi di conversione.\n\n📩 Richiedi una demo: sales@hmplas.com\n\n#VenditeAI #IntelligenzaArtificiale #AutomazioneVendite #LeadGen",
    automation: "🔗 Automazione del marketing end-to-end con n8n e Hermes Agent OS!\n\nAutomatizza l'intero flusso di lavoro, dalla pianificazione dei contenuti social alla qualificazione dei lead, alla generazione di bozze di preventivi e all'aggiornamento in tempo reale del CRM.\n\n✉️ Dettagli di integrazione: sales@hmplas.com\n\n#AutomazioneMarketing #n8n #HermesOS #Workflows",
    campaign: "📈 Gestione delle campagne B2B: Massimo ROI, zero sprechi di tempo.\n\nGestisci in modo efficiente i tuoi budget pubblicitari con il simulatore di intelligenza marketing Hermes Agent OS. Monitora i volumi di lead, i tassi di conversione e il fatturato netto in tempo reale.\n\n📲 Scarica lo studio del caso: sales@hmplas.com\n\n#GestioneCampagne #ROI #MarketingB2B #AnalisiDati"
  },
  ar: {
    product: "📢 بوابة التوريد B2B من HMPLAS: أسرة مستشفيات ومستلزمات طبية مباشرة من المصنع!\n\nنقدم أسرة HMPLAS الكهربائية من فئتي Pro و Comfort مباشرة من المصنع مع مزايا البيع بالجملة. محركات متينة، تصميم مريح وضمان تسليم سريع.\n\n👉 لطلب قائمة أسعار الجملة: sales@hmplas.com\n\n#مستلزمات_طبية #أسرة_مستشفيات #مبيعات_B2B #تجهيز_عيادات",
    leadgen: "🤖 ضاعف مبيعاتك مع مساعدي الذكاء الاصطناعي المستقلين!\n\nتعرف على مساعدي HMPLAS الذكية التي تجيب على استفسارات العملاء في ثوانٍ، وتجهز مسودات عروض الأسعار التلقائية، وتدير جدول مواعيدك. تواصل 24/7 مع العملاء ونسب تحويل عالية.\n\n📩 اطلب نسخة تجريبية: sales@hmplas.com\n\n#ذكاء_اصطناعي #مبيعات_ذكية #أتمتة_المبيعات #مبيعات_تلقائية",
    automation: "🔗 أتمتة التسويق المتكاملة مع n8n و Hermes Agent OS!\n\nأتمت سير العمل بالكامل، من جدولة محتوى شبكات التواصل الاجتماعي إلى تأهيل العملاء المحتملين وتوليد مسودات العروض وتحديث CRM لحظياً.\n\n✉️ تفاصيل التكامل: sales@hmplas.com\n\n#أتمتة_التسويق #أنظمة_Hermes #أتمتة_العمل",
    campaign: "📈 إدارة الحملات الإعلانية B2B: أقصى عائد على الاستثمار (ROI)، صفر إهدار للوقت.\n\nأدر ميزانياتك الإعلانية بكفاءة مع محاكي ذكاء التسويق Hermes Agent OS. تتبع أعداد العملاء ونسب التحويل وصافي الإيرادات لحظياً.\n\n📲 حمل دراسة الحالة: sales@hmplas.com\n\n#إدارة_الحملات #عائد_الاستثمار #تسويق_B2B #تحليل_البيانات"
  },
  ru: {
    product: "📢 Портал B2B-поставок HMPLAS: Медицинские кровати и оборудование напрямую от производителя!\n\nПредлагаем электрические кровати серий Pro и Comfort напрямую с завода по оптовым ценам. Надежные двигатели, эргономичный дизайн и быстрая доставка.\n\n👉 Запросить оптовый прайс-лист: sales@hmplas.com\n\n#МедицинскоеОборудование #МедицинскиеКровати #B2BПоставки",
    leadgen: "🤖 Увеличивайте продажи с автономными ИИ-ассистентами!\n\nИИ-агенты HMPLAS отвечают клиентам за секунды, автоматически создают черновики предложений и планируют встречи в календаре. Поддержка клиентов 24/7 с высокой конверсией.\n\n📩 Запросить демо: sales@hmplas.com\n\n#ИИПродажи #ИскусственныйИнтеллект #Automisation #ГенерацияЛидов",
    automation: "🔗 Полная автоматизация маркетинга с n8n и Hermes Agent OS!\n\nАвтоматизируйте весь цикл: от планирования публикаций в соцсетях до квалификации лидов, создания предложений и мгновенного обновления CRM.\n\n✉️ Узнать больше об интеграциях: sales@hmplas.com\n\n#АвтоматизацияМаркетинга #n8n #HermesOS #БизнесПроцессы",
    campaign: "📈 Управление B2B-кампаниями: Максимальный ROI, минимум затрат.\n\nЭффективно управляйте рекламными бюджетами с помощью симулятора маркетингового интеллекта Hermes Agent OS. Отслеживайте количество лидов, конверсию и чистую прибыль в реальном времени.\n\n📲 Скачать отчет: sales@hmplas.com\n\n#УправлениеРекламой #ROI #B2BМаркетинг #Аналитика"
  },
  tr: {
    product: "📢 HMPLAS B2B Tedarik Portalı: Doğrudan Üreticiden Karyola ve Medikal Malzeme!\n\nPro ve Comfort serisi elektrikli hasta karyolalarımızı, doğrudan fabrikadan toptan satış avantajlarıyla sunuyoruz. Dayanıklı motor yapısı, ergonomik tasarımı ve hızlı teslimat güvencesi.\n\n👉 Toplu sipariş fiyat listesi için: sales@hmplas.com\n\n#MedikalMalzeme #ToptanMedikal #HastaYatagi #B2B",
    leadgen: "🤖 Satışlarınızı Otonom AI Asistanları ile Büyütün!\n\nMüşterilerinizin sorularını saniyeler içinde yanıtlayan, otomatik teklif hazırlayan ve takviminizi yöneten HMPLAS AI asistanları ile tanışın. 7/24 kesintisiz müşteri iletişimi ve yüksek dönüşüm oranları.\n\n📩 Demo randevusu alın: sales@hmplas.com\n\n#YapayZeka #AISales #OtonomSatis #DijitalDonusum",
    automation: "🔗 n8n ve Hermes Agent OS ile Uçtan Uca Pazarlama Otomasyonu!\n\nSosyal medya paylaşımlarından müşteri adayı takibine, otomatik e-posta gönderiminden CRM güncellemelerine kadar tüm pazarlama süreçlerinizi tek bir merkezden yönetin.\n\n✉️ Entegrasyon detayları: sales@hmplas.com\n\n#PazarlamaOtomasyonu #n8n #HermesOS #Verimlilik",
    campaign: "📈 B2B Kampanya Yönetimi: Maksimum ROI, Sıfır Zaman Kaybı.\n\nHermes Agent OS üzerindeki otonom kampanya analiz motorumuz sayesinde reklam bütçenizi en verimli şekilde yönetin. Hangi kanaldan kaç lead geldiğini ve net ciro dönüşümünü anlık izleyin.\n\n📲 Raporu indirin: sales@hmplas.com\n\n#ReklamYonetimi #ROI #B2BPazarlama #VeriAnalizi"
  }
};

export const initSalesSystem = () => {
  initN8nWorkflow();
  initBlackboard();
  initSocialGenerator();
  initRoiCalculator();
};

const initN8nWorkflow = () => {
  const container = document.getElementById('n8n-nodes-container');
  const inspectorTitle = document.getElementById('inspector-node-title');
  const inspectorJson = document.getElementById('inspector-node-json');
  if (!container) return;

  container.innerHTML = `<div class="n8n-connector-line" style="width: 80%; left: 10%;"></div>` + n8nNodesData.map(n => `
    <div class="n8n-node" id="n8n-node-${n.id}" data-node="${n.id}">
      <span class="n8n-icon">${n.icon}</span>
      <span>${n.name}</span>
    </div>
  `).join('');

  n8nNodesData.forEach(n => {
    const el = document.getElementById(`n8n-node-${n.id}`);
    if (el) {
      el.addEventListener('click', () => {
        document.querySelectorAll('.n8n-node').forEach(node => node.classList.remove('active'));
        el.classList.add('active');
        if (inspectorTitle) inspectorTitle.innerHTML = `<span>${n.title}</span>`;
        if (inspectorJson) inspectorJson.textContent = JSON.stringify(n.json, null, 2);
      });
    }
  });
};

const initBlackboard = () => {
  const btnTrigger = document.getElementById('btn-simulate-blackboard');
  const timeSelect = document.getElementById('blackboard-time-select');
  const container = document.getElementById('blackboard-cols-container');
  if (!container) return;

  const cols = ['Triage Ajanı', 'Stok & Fiyat Kontrolü', 'Teklif Derleyici', 'Zamanlayıcı & Politika'];
  const colIds = ['triage', 'verifier', 'synth', 'policy'];

  const renderCols = () => {
    container.innerHTML = `<div class="blackboard-grid">` + colIds.map((id, index) => `
      <div class="blackboard-col" id="bb-col-${id}">
        <div class="col-header">${cols[index]}</div>
      </div>
    `).join('') + `</div>`;
  };

  renderCols();

  if (btnTrigger) {
    btnTrigger.addEventListener('click', () => {
      renderCols();
      btnTrigger.disabled = true;
      logNtfy('Bilgi', 'Hermes Swarm B2B satış orkestrasyonu simülasyonu başlatıldı.');

      const triage = document.getElementById('bb-col-triage');
      const verifier = document.getElementById('bb-col-verifier');
      const synth = document.getElementById('bb-col-synth');
      const policy = document.getElementById('bb-col-policy');

      const isViolation = timeSelect ? timeSelect.value === '06:00' : false;

      // Stage 1: Triage
      setTimeout(() => {
        createCard(triage, 'bb-card-triage', 'Triage Ajanı', 'Yeni B2B satış talebi ayrıştırıldı. Karyola ve malzeme adetleri listelendi.', 'active');
        logNtfy('Bilgi', 'Blackboard: Triage ajanı satış talebini analiz etti.');
        setTimeout(() => setCardStatus('bb-card-triage', 'success'), 800);
      }, 500);

      // Stage 2: Stock & Price Verifier
      setTimeout(() => {
        createCard(verifier, 'bb-card-verifier', 'Verifikasyon Ajanı', 'Stok durumu kontrol ediliyor. Bayi indirim oranları teyit ediliyor...', 'active');
        logNtfy('Bilgi', 'Blackboard: Verifikasyon ajanı stok ve fiyat sorgusunu başlattı.');
        setTimeout(() => {
          setCardStatus('bb-card-verifier', 'success');
          document.getElementById('bb-card-verifier').innerHTML = `<strong>Verifikasyon:</strong> Stok durumu UYGUN. Bayi iskonto oranı onaylandı.`;
        }, 1000);
      }, 1800);

      // Stage 3: Synthesizer
      setTimeout(() => {
        createCard(synth, 'bb-card-synth', 'Teklif Ajanı', 'Müşteriye iletilecek teklif taslak şablonu PDF formatında oluşturuluyor...', 'active');
        logNtfy('Bilgi', 'Blackboard: Teklif ajanı otonom satış teklifini hazırlıyor.');
        setTimeout(() => setCardStatus('bb-card-synth', 'success'), 1200);
      }, 3200);

      // Stage 4: Policy / Scheduler
      setTimeout(() => {
        const timeVal = timeSelect ? timeSelect.value : '14:00';
        createCard(policy, 'bb-card-policy', 'Politika Ajanı', `Toplantı zamanlama kontrolü: Randevu saati ${timeVal}...`, 'active');
        logNtfy('Bilgi', 'Blackboard: Politika ajanı randevu uygunluğunu denetliyor.');
        
        setTimeout(() => {
          if (isViolation) {
            setCardStatus('bb-card-policy', 'failed');
            document.getElementById('bb-card-policy').innerHTML = `<strong>POLİTİKA UYARISI!</strong> Randevu saati (${timeVal}) sabah 07:00 mesai başlangıç sınırını ihlal ediyor!`;
            logNtfy('ALARM', `Hermes Politika: Satış randevusu reddedildi! Saat ${timeVal} mesai saatleri dışındadır.`);
          } else {
            setCardStatus('bb-card-policy', 'success');
            document.getElementById('bb-card-policy').innerHTML = `<strong>Zamanlayıcı:</strong> Satış randevusu (${timeVal}) onaylandı. Takvim kaydı oluşturuldu.`;
            logNtfy('Bilgi', `Hermes Politika: Randevu saati ${timeVal} onaylandı ve CRM'e işlendi.`);
          }
          btnTrigger.disabled = false;
        }, 1500);
      }, 4800);
    });
  }
};

const createCard = (parent, id, title, content, state) => {
  if (!parent) return;
  const card = document.createElement('div');
  card.className = `blackboard-card ${state}`;
  card.id = id;
  card.innerHTML = `<strong>${title}:</strong> ${content}`;
  parent.appendChild(card);
};

const setCardStatus = (id, status) => {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('active', 'success', 'failed');
    el.classList.add(status);
  }
};

const initSocialGenerator = () => {
  const socialLangSelect = document.getElementById('social-lang-select');
  const socialChannelSelect = document.getElementById('social-channel-select');
  const socialPillarSelect = document.getElementById('social-pillar-select');
  const textarea = document.getElementById('social-post-textarea');
  const charCount = document.getElementById('social-char-count');
  const btnCopy = document.getElementById('btn-copy-social-post');
  const btnCopyText = document.getElementById('btn-copy-social-text');

  if (!socialLangSelect || !socialPillarSelect || !textarea) return;

  const languages = [
    { code: 'en', name: 'İngilizce (English)' },
    { code: 'fr', name: 'Fransızca (French)' },
    { code: 'it', name: 'İtalyanca (Italian)' },
    { code: 'ar', name: 'Arapça (Arabic)' },
    { code: 'ru', name: 'Rusça (Russian)' },
    { code: 'tr', name: 'Türkçe (Turkish)' }
  ];
  const pillars = [
    { id: 'product', name: 'B2B Ürün Tanıtımı' },
    { id: 'leadgen', name: 'AI Satış Asistanları' },
    { id: 'automation', name: 'Pazarlama Otomasyonu' },
    { id: 'campaign', name: 'Kampanya Analitiği (ROI)' }
  ];

  socialLangSelect.innerHTML = languages.map(l => `<option value="${l.code}">${l.name}</option>`).join('');
  socialPillarSelect.innerHTML = pillars.map(p => `<option value="${p.id}">${p.name}</option>`).join('');

  const generatePost = () => {
    const lang = socialLangSelect.value;
    const channel = socialChannelSelect.value;
    const pillar = socialPillarSelect.value;
    let postText = socialPosts[lang]?.[pillar] || '';

    if (channel === 'facebook') {
      const fbIntros = {
        en: '📢 Community Share - B2B Marketing & Medical Sales:\n\n',
        fr: '📢 Partage communautaire - Marketing B2B & Vente Médicale :\n\n',
        it: '📢 Condivisione della community - Marketing B2B e Vendite Mediche:\n\n',
        ar: '📢 مشاركة مجتمعية - تسويق B2B ومبيعات طبية:\n\n',
        ru: '📢 Публикация в сообществе - B2B маркетинг и продажи:\n\n',
        tr: '📢 Topluluk Paylaşımı - B2B Pazarlama & Medikal Satış:\n\n'
      };
      postText = (fbIntros[lang] || '') + postText
        .replace('👉 Inquire for wholesale catalog', '💬 Interested? Let\'s discuss in the comments or send an email')
        .replace('👉 Per listino prezzi all\'ingrosso', '💬 Interessato? Parliamone nei commenti o invia una email')
        .replace('👉 لطلب قائمة أسعار الجملة', '💬 هل أنت مهتم؟ لنناقش في التعليقات أو أرسل بريداً إلكترونياً')
        .replace('👉 Запросить оптовый прайс-лист', '💬 Интересует опт? Пишите в комментариях или на почту')
        .replace('👉 Toplu sipariş fiyat listesi için', '💬 Yorumlarda görüşlerinizi belirtin veya mail atın');
    }

    textarea.value = postText;
    charCount.textContent = `Karakter: ${postText.length}`;
  };

  [socialLangSelect, socialChannelSelect, socialPillarSelect].forEach(select => {
    select.addEventListener('change', generatePost);
  });

  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      textarea.select();
      navigator.clipboard.writeText(textarea.value).then(() => {
        btnCopyText.textContent = 'Kopyalandı! ✔';
        logNtfy('Bilgi', 'Sosyal medya pazarlama içeriği panoya kopyalandı.');
        setTimeout(() => { btnCopyText.textContent = 'Panoya Kopyala'; }, 2000);
      });
    });
  }

  generatePost();
};

const initRoiCalculator = () => {
  const slider = document.getElementById('social-budget-slider');
  const budgetVal = document.getElementById('social-budget-value');
  const metricsContainer = document.getElementById('roi-metrics-container');
  const roiText = document.getElementById('social-calc-roi-percentage');

  if (!slider || !metricsContainer) return;

  const updateRoi = (budget) => {
    budgetVal.textContent = `${budget.toLocaleString('tr-TR')} €`;
    const reach = budget * 35;
    const leads = Math.round(reach * 0.003);
    const sales = Math.max(1, Math.round(leads * 0.05));
    const revenue = sales * 3500;
    const netRoi = Math.round(((revenue - budget) / budget) * 100);

    metricsContainer.innerHTML = `
      <div class="roi-metric-item">
        <div class="roi-metric-label">Tahmini B2B Erişim</div>
        <div class="roi-metric-value">${reach.toLocaleString('tr-TR')} Yetkili</div>
      </div>
      <div class="roi-metric-item">
        <div class="roi-metric-label">Kazanılan Lead Hacmi</div>
        <div class="roi-metric-value">${leads.toLocaleString('tr-TR')} B2B Firma</div>
      </div>
      <div class="roi-metric-item">
        <div class="roi-metric-label">Otonom Toptan Satış</div>
        <div class="roi-metric-value">${sales.toLocaleString('tr-TR')} Sipariş</div>
      </div>
      <div class="roi-metric-item">
        <div class="roi-metric-label">Toplam Ciro Değeri</div>
        <div class="roi-metric-value">${revenue.toLocaleString('tr-TR')} €</div>
      </div>
    `;

    if (roiText) {
      roiText.textContent = `Yatırılan Bütçe: ${budget.toLocaleString('tr-TR')} €. Net Ciro Değeri: ${revenue.toLocaleString('tr-TR')} €. Otonom B2B Pazarlama Yatırım Getirisi (ROI): %${netRoi}.`;
    }
  };

  slider.addEventListener('input', (e) => {
    updateRoi(parseInt(e.target.value));
  });

  updateRoi(1500);
};
