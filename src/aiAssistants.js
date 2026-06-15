import { logNtfy } from './main.js';

// 1. AI Assistants Database
const assistants = [
  { id: 'whatsapp', name: 'WhatsApp Satış Ajanı', icon: '💬', status: 'Aktif', desc: '7/24 küresel ölçekte (TR, EN, DE, FR, ES, IT, AR, RU) müşteri sorularını yanıtlar, katalog ve fiyat listesi iletir.' },
  { id: 'webchat', name: 'Web Sohbet Asistanı', icon: '🤖', status: 'Aktif', desc: 'Web sitesi ziyaretçilerini yerel dillerinde karşılar, ihtiyaç analizi yapar ve lead toplar.' },
  { id: 'email', name: 'E-Posta Otomasyonu', icon: '✉️', status: 'Aktif', desc: 'B2B medikal tedarik taleplerini çok dilli analiz ederek otomatik teklif taslakları hazırlar.' },
  { id: 'voice', name: 'Sesli Arama Ajanı', icon: '📞', status: 'Standby', desc: 'Teklif onayları ve randevu teyitleri için farklı ülkelerdeki müşterileri otonom arar.' }
];

// 2. Multilingual Chat Simulation Dialogues
const chatDialogues = {
  tr: [
    { sender: 'client', text: 'Merhaba, B2B hasta karyolası ve medikal malzeme fiyat listenizi alabilir miyim?' },
    { sender: 'assistant', text: 'Tabii ki! HMPLAS Pro ve Comfort serisi elektrikli hasta karyolalarımızın güncel bayi fiyat listesini hemen hazırlıyorum. Toptan alım miktarını öğrenebilir miyim?' },
    { sender: 'client', text: 'Kliniklerimiz için ilk etapta 15 adet 4 motorlu karyola ve 15 adet havalı yatak ihtiyacımız var.' },
    { sender: 'assistant', text: 'Harika! 15 adet için özel %20 B2B indirim uygulayarak teklifinizi hazırladım. İletişim bilgilerinizi alabilir miyim, hemen WhatsApp ve E-posta üzerinden ileteyim?' },
    { sender: 'client', text: 'Tabii, hakan@klinikgrup.com - 0532 123 4567' },
    { sender: 'assistant', text: 'Bilgilerinizi kaydettim. Teklif belgeniz (PDF) oluşturuldu ve e-postanıza gönderildi. Detayları netleştirmek için yarın saat 14:00\'e randevu ayarlıyorum, uygun mudur?' },
    { sender: 'client', text: 'Evet, uygundur. Çok teşekkürler, çok hızlısınız!' },
    { sender: 'assistant', text: 'Rica ederim! HMPLAS Akıllı Asistanı olarak size yardımcı olmaktan mutluluk duydum. Randevunuz takvime işlendi. Görüşmek üzere!' }
  ],
  en: [
    { sender: 'client', text: 'Hello, could I get your B2B price list for hospital beds and medical accessories?' },
    { sender: 'assistant', text: 'Of course! I am preparing the wholesale price list for our HMPLAS Pro and Comfort series motorized beds. Could you please specify the target quantity?' },
    { sender: 'client', text: 'We need 15 units of 4-motor beds and 15 air mattresses for our clinic expansion.' },
    { sender: 'assistant', text: 'Great! I have applied a special 20% B2B discount for 15 units. May I have your contact details to send the proposal PDF via email & WhatsApp?' },
    { sender: 'client', text: 'Sure, hakan@klinikgrup.com - +44 7911 123456' },
    { sender: 'assistant', text: 'Perfect! I have generated the B2B proposal and sent it to your email. I\'ve also booked a call for tomorrow at 2:00 PM CET to finalize details. Is that fine?' },
    { sender: 'client', text: 'Yes, that works great. Thank you so much for the quick response!' },
    { sender: 'assistant', text: 'You are welcome! As your HMPLAS AI Assistant, it is my pleasure. Your meeting is registered. Have a nice day!' }
  ],
  de: [
    { sender: 'client', text: 'Hallo, kann ich Ihre B2B-Preisliste für Pflegebetten und medizinisches Zubehör erhalten?' },
    { sender: 'assistant', text: 'Natürlich! Ich erstelle die Großhandelspreisliste für unsere motorisierten HMPLAS Pro- und Comfort-Betten. Könnten Sie die gewünschte Menge angeben?' },
    { sender: 'client', text: 'Wir benötigen 15 Stück 4-motorige Betten und 15 Wechseldruckmatratzen für unsere Klinik.' },
    { sender: 'assistant', text: 'Sehr gut! Ich habe einen speziellen B2B-Rabatt von 20% für 15 Einheiten angewendet. Darf ich Ihre Kontaktdaten haben, um das Angebot per E-Mail und WhatsApp zu senden?' },
    { sender: 'client', text: 'Sicher, hakan@klinikgrup.com - +49 170 1234567' },
    { sender: 'assistant', text: 'Perfekt! Ich habe das B2B-Angebot erstellt und an Ihre E-Mail gesendet. Außerdem habe ich für morgen um 14:00 Uhr CET einen Anruf gebucht. Passt das?' },
    { sender: 'client', text: 'Ja, das passt super. Vielen Dank für die schnelle Antwort!' },
    { sender: 'assistant', text: 'Gern geschehen! Als Ihr HMPLAS KI-Assistent freue ich mich, Ihnen zu helfen. Ihr Termin ist eingetragen. Einen schönen Tag noch!' }
  ],
  fr: [
    { sender: 'client', text: 'Bonjour, puis-je obtenir votre liste de prix B2B pour les lits médicalisés et accessoires ?' },
    { sender: 'assistant', text: 'Bien sûr ! Je prépare le tarif de gros pour nos lits motorisés HMPLAS Pro et Comfort. Pourriez-vous préciser la quantité souhaitée ?' },
    { sender: 'client', text: 'Nous avons besoin de 15 lits à 4 moteurs et 15 matelas à air pour notre clinique.' },
    { sender: 'assistant', text: 'Excellent ! J\'ai appliqué une remise B2B spéciale de 20% pour 15 unités. Puis-je avoir vos coordonnées pour envoyer l\'offre par e-mail et WhatsApp ?' },
    { sender: 'client', text: 'Bien sûr, hakan@klinikgrup.com - +33 6 1234 5678' },
    { sender: 'assistant', text: 'Parfait ! J\'ai généré l\'offre B2B et l\'ai envoyée à votre e-mail. J\'ai aussi planifié un appel pour demain à 14h00 CET pour finaliser. C\'est bon ?' },
    { sender: 'client', text: 'Oui, c\'est parfait. Merci beaucoup pour votre rapidité !' },
    { sender: 'assistant', text: 'Avec plaisir ! En tant qu\'assistant IA HMPLAS, c\'est un honneur de vous aider. Votre rendez-vous est enregistré. Bonne journée !' }
  ],
  es: [
    { sender: 'client', text: 'Hola, ¿podría obtener su lista de precios B2B para camas articuladas y accesorios médicos?' },
    { sender: 'assistant', text: '¡Por supuesto! Estoy preparando la lista de precios al por mayor para nuestras camas motorizadas HMPLAS Pro y Comfort. ¿Could you indicate the quantity?' },
    { sender: 'client', text: 'Necesitamos 15 camas de 4 motores y 15 colchones de aire para nuestra clínica.' },
    { sender: 'assistant', text: '¡Excelente! He aplicado un descuento B2B especial del 20% para 15 unidades. ¿Me facilita sus datos de contacto para enviar la oferta por email y WhatsApp?' },
    { sender: 'client', text: 'Claro, hakan@klinikgrup.com - +34 612 345 678' },
    { sender: 'assistant', text: '¡Perfecto! He generado la propuesta B2B y la he enviado a su correo electrónico. También he programado una llamada para mañana a las 14:00 CET. ¿Le parece bien?' },
    { sender: 'client', text: 'Sí, me parece genial. ¡Muchas gracias por la rapidez!' },
    { sender: 'assistant', text: '¡De nada! Como su asistente de IA de HMPLAS, es un placer ayudarle. Su cita está registrada. ¡Buen día!' }
  ],
  it: [
    { sender: 'client', text: 'Buongiorno, potrei avere il vostro listino prezzi B2B per letti ortopedici e accessori medici?' },
    { sender: 'assistant', text: 'Certamente! Sto preparando il listino prezzi all\'ingrosso per i nostri letti motorizzati HMPLAS Pro e Comfort. Potrebbe specificare la quantità desiderata?' },
    { sender: 'client', text: 'Abbiamo bisogno di 15 letti a 4 motori e 15 materassi ad aria per la nostra clinica.' },
    { sender: 'assistant', text: 'Ottimo! Ho applicato uno sconto B2B speciale del 20% per 15 unità. Posso avere i suoi dati di contatto per inviare l\'offerta via email e WhatsApp?' },
    { sender: 'client', text: 'Certo, hakan@klinikgrup.com - +39 02 1234567' },
    { sender: 'assistant', text: 'Perfetto! Ho generato la proposta B2B e l\'ho inviata alla sua email. Inoltre, ho prenotato una chiamata per domani alle 14:00 CET per definire i dettagli. Va bene?' },
    { sender: 'client', text: 'Sì, va benissimo. Grazie mille per la rapidità!' },
    { sender: 'assistant', text: 'Prego! Come suo assistente HMPLAS AI, è un piacere aiutarla. Il suo appuntamento è registrato. Buona giornata!' }
  ],
  ar: [
    { sender: 'client', text: 'مرحباً، هل يمكنني الحصول على قائمة أسعار B2B لأسرة المستشفيات والمستلزمات الطبية؟' },
    { sender: 'assistant', text: 'بالتأكيد! أقوم حالياً بإعداد قائمة أسعار الجملة لأسرة HMPLAS Pro و Comfort الكهربائية. هل يمكنك تحديد الكمية المطلوبة؟' },
    { sender: 'client', text: 'نحتاج إلى 15 سريراً ذو 4 محركات و15 مرتبة هوائية لتوسعة عيادتنا.' },
    { sender: 'assistant', text: 'ممتاز! لقد قمت بتطبيق خصم B2B خاص بنسبة 20% لـ 15 وحدة. هل يمكنني الحصول على تفاصيل الاتصال بك لإرسال عرض السعر PDF عبر البريد الإلكتروني والواتساب؟' },
    { sender: 'client', text: 'بالتأكيد، hakan@klinikgrup.com - +971 50 1234567' },
    { sender: 'assistant', text: 'رائع! تم إنشاء عرض السعر وإرساله إلى بريدك الإلكتروني. كما حجزت موعد اتصال لغد الساعة 14:00 بتوقيت وسط أوروبا لتأكيد التفاصيل. هل هذا مناسب؟' },
    { sender: 'client', text: 'نعم، هذا ممتاز جداً. شكراً جزيلاً على سرعة الاستجابة!' },
    { sender: 'assistant', text: 'على الرحب والسعة! يسعدني دائماً مساعدتك كأخصائي مبيعات الذكاء الاصطناعي من HMPLAS. تم تسجيل الموعد. طاب يومك!' }
  ],
  ru: [
    { sender: 'client', text: 'Здравствуйте, могу ли я получить ваш прайс-лист B2B на медицинские кровати и сопутствующие товары?' },
    { sender: 'assistant', text: 'Конечно! Я готовлю оптовый прайс-лист для наших электрических кроватей серий HMPLAS Pro и Comfort. Уточните, пожалуйста, количество?' },
    { sender: 'client', text: 'Для нашей клиники нам нужно 15 четырехсекционных кроватей и 15 противопролежневых матрасов.' },
    { sender: 'assistant', text: 'Отлично! Я применил специальную скидку B2B 20% на 15 единиц. Могу ли я получить ваши контакты для отправки коммерческого предложения в PDF по email и WhatsApp?' },
    { sender: 'client', text: 'Конечно, hakan@klinikgrup.com - +7 912 123-45-67' },
    { sender: 'assistant', text: 'Прекрасно! Предложение сформировано и отправлено на ваш email. Также я забронировал звонок на завтра в 14:00 CET для уточнения деталей. Вам удобно?' },
    { sender: 'client', text: 'Да, отлично подходит. Большое спасибо за оперативность!' },
    { sender: 'assistant', text: 'Рад помочь! Как ваш ИИ-ассистент HMPLAS, я всегда к вашим услугам. Встреча запланирована. Хорошего дня!' }
  ]
};

// 3. Lead Pipeline Initial Data
let leads = [
  { id: 1, name: 'Klinik Medikal A.Ş.', volume: '15 Yatak', stage: 'new', color: '#d4af37' },
  { id: 2, name: 'Ege Bakımevi Grubu', volume: '30 Yatak', stage: 'contacted', color: '#c5a059' },
  { id: 3, name: 'Özel Güven Hastanesi', volume: '10 Yatak', stage: 'proposal', color: '#007f4e' },
  { id: 4, name: 'Lokman Hekim Sağlık', volume: '25 Yatak', stage: 'won', color: '#10b981' }
];

// Automation State
let autoPipelineActive = false;
let autoPipelineInterval = null;

export const initAiAssistants = () => {
  renderAssistants();
  renderChatSimulation();
  renderLeadPipeline();
  setupNewLeadForm();
  setupDragAndDrop();
  setupPipelineAutomation();
};

const renderAssistants = () => {
  const container = document.getElementById('assistants-grid-container');
  if (!container) return;

  container.innerHTML = assistants.map(a => `
    <div class="assistant-card ${a.status === 'Aktif' ? 'active' : ''}">
      <div class="assistant-card-header">
        <span class="assistant-icon">${a.icon}</span>
        <span class="assistant-status-badge ${a.status === 'Aktif' ? 'active' : ''}">${a.status}</span>
      </div>
      <h4>${a.name}</h4>
      <p>${a.desc}</p>
    </div>
  `).join('');
};

const renderChatSimulation = () => {
  const chatBox = document.getElementById('assistant-chat-box');
  const btnTrigger = document.getElementById('btn-start-chat-sim');
  const langSelect = document.getElementById('assistant-lang-select');
  if (!chatBox || !btnTrigger || !langSelect) return;

  let messageIndex = 0;
  let chatInterval = null;

  const typeMessage = () => {
    const selectedLang = langSelect.value || 'en';
    const dialogue = chatDialogues[selectedLang] || chatDialogues.en;

    if (messageIndex >= dialogue.length) {
      clearInterval(chatInterval);
      btnTrigger.disabled = false;
      btnTrigger.querySelector('span').textContent = selectedLang === 'tr' ? 'Sohbet Simülasyonunu Yeniden Başlat' : 'Restart Chat Simulation';
      logNtfy('Bilgi', `AI Satış Asistanı [${selectedLang.toUpperCase()}] sohbet simülasyonunu başarıyla tamamladı.`);
      
      const newLead = {
        id: Date.now(),
        name: selectedLang === 'tr' ? 'Avrupa Klinik Grubu' : 'European Clinic Group',
        volume: '15 Yatak',
        stage: 'new',
        color: '#d4af37'
      };
      leads.push(newLead);
      renderLeadPipeline();
      return;
    }

    const msg = dialogue[messageIndex];
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${msg.sender === 'client' ? 'client' : 'assistant'}`;
    bubble.innerHTML = `
      <div class="bubble-sender">${msg.sender === 'client' ? (selectedLang === 'tr' ? 'Müşteri' : 'Client') : 'HMPLAS AI'}</div>
      <div class="bubble-text">${msg.text}</div>
    `;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    if (msg.sender === 'assistant' && messageIndex === 1) {
      logNtfy('Bilgi', `AI Ajanı [${selectedLang.toUpperCase()}]: Satış talebine yanıt verdi.`);
    } else if (msg.sender === 'assistant' && messageIndex === 5) {
      logNtfy('ALARM', `E-posta Ajanı [${selectedLang.toUpperCase()}]: PDF teklif belgesi ve toplantı randevusu gönderildi.`);
    }

    messageIndex++;
  };

  btnTrigger.addEventListener('click', () => {
    chatBox.innerHTML = '';
    messageIndex = 0;
    btnTrigger.disabled = true;
    const selectedLang = langSelect.value || 'en';
    btnTrigger.querySelector('span').textContent = selectedLang === 'tr' ? 'Asistan Yanıtlıyor...' : 'Assistant Responding...';
    
    if (chatInterval) clearInterval(chatInterval);
    
    typeMessage();
    chatInterval = setInterval(typeMessage, 3000);
  });
};

const renderLeadPipeline = () => {
  const stages = {
    new: document.getElementById('pipeline-new'),
    contacted: document.getElementById('pipeline-contacted'),
    proposal: document.getElementById('pipeline-proposal'),
    won: document.getElementById('pipeline-won')
  };

  Object.keys(stages).forEach(key => {
    if (stages[key]) {
      stages[key].innerHTML = '';
    }
  });

  leads.forEach(lead => {
    const parent = stages[lead.stage];
    if (!parent) return;

    const card = document.createElement('div');
    card.className = 'pipeline-card';
    card.setAttribute('draggable', 'true');
    card.setAttribute('data-id', lead.id);
    card.style.borderLeft = `4px solid ${lead.color}`;
    card.innerHTML = `
      <div class="lead-title">${lead.name}</div>
      <div class="lead-details">
        <span>📦 ${lead.volume}</span>
        <button class="btn-lead-move" data-id="${lead.id}">➔</button>
      </div>
    `;

    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', lead.id);
      card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    const btnMove = card.querySelector('.btn-lead-move');
    btnMove.addEventListener('click', () => {
      moveLead(lead.id);
    });

    parent.appendChild(card);
  });
};

const moveLead = (id) => {
  const nextStages = {
    new: 'contacted',
    contacted: 'proposal',
    proposal: 'won',
    won: 'new'
  };

  leads = leads.map(l => {
    if (l.id === id) {
      const nextStage = nextStages[l.stage];
      logNtfy('Bilgi', `Müşteri "${l.name}" aşama değiştirdi: ${l.stage.toUpperCase()} ➔ ${nextStage.toUpperCase()}`);
      return { ...l, stage: nextStage };
    }
    return l;
  });

  renderLeadPipeline();
};

const setupNewLeadForm = () => {
  const btnAdd = document.getElementById('btn-add-manual-lead');
  const leadNameInput = document.getElementById('manual-lead-name');
  const leadVolInput = document.getElementById('manual-lead-volume');

  if (!btnAdd || !leadNameInput || !leadVolInput) return;

  btnAdd.addEventListener('click', () => {
    const name = leadNameInput.value.trim();
    const volume = leadVolInput.value.trim() || 'Belirtilmedi';

    if (!name) {
      logNtfy('Uyarı', 'Lütfen müşteri adını girin.');
      return;
    }

    const newLead = {
      id: Date.now(),
      name,
      volume,
      stage: 'new',
      color: '#d4af37'
    };

    leads.push(newLead);
    renderLeadPipeline();
    logNtfy('Bilgi', `Müşteri Adayı Eklendi: "${name}" (${volume})`);

    leadNameInput.value = '';
    leadVolInput.value = '';
  });
};

const setupDragAndDrop = () => {
  const cols = document.querySelectorAll('.pipeline-col');
  
  cols.forEach(col => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      col.classList.add('drag-over');
    });

    col.addEventListener('dragleave', () => {
      col.classList.remove('drag-over');
    });

    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('drag-over');
      
      const id = parseInt(e.dataTransfer.getData('text/plain'));
      const cardListContainer = col.querySelector('.pipeline-col-cards');
      if (!cardListContainer) return;
      
      const targetStage = cardListContainer.id.replace('pipeline-', '');
      
      if (!isNaN(id)) {
        let leadName = '';
        let prevStage = '';
        
        leads = leads.map(l => {
          if (l.id === id) {
            leadName = l.name;
            prevStage = l.stage;
            return { ...l, stage: targetStage };
          }
          return l;
        });
        
        if (leadName && prevStage !== targetStage) {
          logNtfy('Bilgi', `[Drag & Drop] "${leadName}" sürüklenerek taşındı: ${prevStage.toUpperCase()} ➔ ${targetStage.toUpperCase()}`);
        }
        
        renderLeadPipeline();
      }
    });
  });
};

const setupPipelineAutomation = () => {
  const btnToggle = document.getElementById('btn-toggle-auto-pipeline');
  if (!btnToggle) return;

  btnToggle.addEventListener('click', () => {
    autoPipelineActive = !autoPipelineActive;
    if (autoPipelineActive) {
      btnToggle.classList.add('active');
      btnToggle.textContent = 'Pipeline Otomasyonu: Aktif';
      logNtfy('Bilgi', 'Otonom B2B Avrupa satış takip otomasyonu devrede.');
      
      autoPipelineInterval = setInterval(() => {
        const nonWonLeads = leads.filter(l => l.stage !== 'won');
        if (nonWonLeads.length > 0) {
          const randomLead = nonWonLeads[Math.floor(Math.random() * nonWonLeads.length)];
          moveLead(randomLead.id);
        } else {
          const randomLead = leads[Math.floor(Math.random() * leads.length)];
          if (randomLead) {
            leads = leads.map(l => {
              if (l.id === randomLead.id) {
                return { ...l, stage: 'new' };
              }
              return l;
            });
            logNtfy('Bilgi', `[Otomasyon] "${randomLead.name}" için yeni bir Avrupa B2B talebi algılandı.`);
            renderLeadPipeline();
          }
        }
      }, 5000);
    } else {
      btnToggle.classList.remove('active');
      btnToggle.textContent = 'Pipeline Otomasyonu: Kapalı';
      logNtfy('Bilgi', 'Otonom B2B takip otomasyonu durduruldu.');
      if (autoPipelineInterval) {
        clearInterval(autoPipelineInterval);
        autoPipelineInterval = null;
      }
    }
  });
};
