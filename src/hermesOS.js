import { logNtfy } from './main.js';

// 1. Model Providers and Models Database
const providerModels = {
  newsportal: [
    { value: 'step', text: 'Step 3.7 Flash (Newsportal - Ücretsiz)' },
    { value: 'neatron', text: 'Neatron 3 Ultra (Newsportal - Ücretsiz)' }
  ],
  openrouter: [
    { value: 'n2', text: 'N2 Free (OpenRouter - Ücretsiz)' },
    { value: 'nex2', text: 'NEX2 Free (OpenRouter - Ücretsiz)' },
    { value: 'free-general', text: 'Free General LLM (OpenRouter)' }
  ],
  'coding-plans': [
    { value: 'glm', text: 'GLM 5.2 (Coding Plan - Sınırsız)' },
    { value: 'kimmy', text: 'Kimmy K2.7 (Coding Plan - Sınırsız)' },
    { value: 'miniax', text: 'Miniax M3 (Coding Plan - Sınırsız)' }
  ]
};

// 2. Jarvis Responses Database
const jarvisResponses = {
  'open-site': {
    speech: 'Jarvis, benim için web sitesini açar mısın?',
    response: '[Jarvis] ➜ Anlaşıldı efendim. HMPLAS B2B pazarlama arayüzünü tarayıcınızda açıyorum...'
  },
  'check-models': {
    speech: 'Jarvis, modelleri doğrula.',
    response: '[Jarvis] ➜ Step 3.7 Flash ve Neatron 3 Ultra aktif durumda, efendim.'
  },
  'optimize-token': {
    speech: 'Jarvis, Headroom token tasarrufunu devreye al.',
    response: '[Jarvis] ➜ Headroom açık kaynak kodlu modülü aktif hale getirildi. Token kullanımı %40 optimize edildi.'
  },
  'start-swarm': {
    speech: 'Jarvis, otonom video üretim hattını (Swarm) başlat.',
    response: '[Jarvis] ➜ Hyperframes video swarm üretim hattı tetiklendi efendim. Kanban panosunu takip edebilirsiniz.'
  }
};

// State Variables
let heygenActive = false;
let swarmRunning = false;
let headroomActive = false;
let savedTokens = 0;
let savingsPercent = 0;

export const initHermesOS = () => {
  initModelSettings();
  initObsidianMCP();
  initHyperframesSwarm();
  initJarvisVoice();
  initOptimizer();
};

const initModelSettings = () => {
  const providerSelect = document.getElementById('agent-provider-select');
  const modelSelect = document.getElementById('agent-model-select');
  const oauthDot = document.getElementById('oauth-status-dot');
  const oauthTitle = document.getElementById('oauth-status-title');
  const oauthDesc = document.getElementById('oauth-status-desc');
  const btnOauth = document.getElementById('btn-oauth-toggle');

  if (!providerSelect || !modelSelect) return;

  const updateModels = () => {
    const provider = providerSelect.value;
    const models = providerModels[provider] || [];
    
    modelSelect.innerHTML = models.map(m => `<option value="${m.value}">${m.text}</option>`).join('');

    if (provider === 'newsportal') {
      if (oauthDot) oauthDot.style.backgroundColor = 'var(--success)';
      if (oauthTitle) oauthTitle.textContent = 'Newsportal OAuth Doğrulandı';
      if (oauthDesc) oauthDesc.textContent = 'Nvidia Step/Neatron ücretsiz modellerine güvenli erişim aktif.';
      if (btnOauth) { btnOauth.style.display = 'block'; btnOauth.textContent = 'Oturumu Kapat'; }
    } else if (provider === 'openrouter') {
      if (oauthDot) oauthDot.style.backgroundColor = 'var(--secondary)';
      if (oauthTitle) oauthTitle.textContent = 'OpenRouter Bağlantısı Aktif';
      if (oauthDesc) oauthDesc.textContent = 'Ücretsiz API anahtarı üzerinden genel arama modeli devrede.';
      if (btnOauth) btnOauth.style.display = 'none';
    } else {
      if (oauthDot) oauthDot.style.backgroundColor = 'var(--accent)';
      if (oauthTitle) oauthTitle.textContent = 'Coding Plan Aktif (Oorthth)';
      if (oauthDesc) oauthDesc.textContent = 'Sınırsız kodlama planı ile video ve web geliştirme devrede.';
      if (btnOauth) { btnOauth.style.display = 'block'; btnOauth.textContent = 'OAuth Girişi Yap'; }
    }
    logNtfy('Bilgi', `Model sağlayıcı değiştirildi: ${providerSelect.options[providerSelect.selectedIndex].text}`);
  };

  providerSelect.addEventListener('change', updateModels);
  updateModels();

  if (btnOauth) {
    btnOauth.addEventListener('click', () => {
      if (btnOauth.textContent === 'Oturumu Kapat') {
        if (oauthDot) oauthDot.style.backgroundColor = 'var(--danger)';
        if (oauthTitle) oauthTitle.textContent = 'Oturum Kapatıldı';
        if (oauthDesc) oauthDesc.textContent = 'Ücretsiz modelleri aktif etmek için lütfen giriş yapın.';
        btnOauth.textContent = 'OAuth Girişi Yap';
        logNtfy('Uyarı', 'Newsportal OAuth oturumu sonlandırıldı.');
      } else {
        updateModels();
      }
    });
  }
};

const initObsidianMCP = () => {
  const btnToggle = document.getElementById('btn-mcp-vault-toggle');
  const statusText = document.getElementById('mcp-vault-status-text');
  const filesList = document.getElementById('obsidian-files-list');

  const files = [
    { name: 'C:/Obsidian/Vault/hermes-agentos-logs.md', size: '2.4 KB' },
    { name: 'C:/Obsidian/Vault/skills-hyperframes-schema.md', size: '1.8 KB' },
    { name: 'C:/Obsidian/Vault/b2b-customer-feedback.md', size: '3.1 KB' }
  ];

  const renderFiles = (isConnected) => {
    if (!filesList) return;
    if (isConnected) {
      filesList.innerHTML = files.map(f => `
        <div style="color: var(--secondary); padding: 0.25rem 0;">📄 ${f.name} (${f.size})</div>
      `).join('');
    } else {
      filesList.innerHTML = '<div style="color: var(--text-muted); padding: 0.5rem 0;">Bağlantı kesildi. Obsidian kasası çevrimdışı.</div>';
    }
  };

  renderFiles(true);

  if (btnToggle && statusText) {
    btnToggle.addEventListener('click', () => {
      const isConnected = statusText.textContent === 'Bağlantıyı Kes';
      if (isConnected) {
        statusText.textContent = 'Bağlantı Kur';
        btnToggle.classList.remove('active');
        renderFiles(false);
        logNtfy('Uyarı', 'Obsidian MCP Vault bağlantısı kesildi. Yapay zeka ajanları ikinci beyne erişemiyor.');
      } else {
        statusText.textContent = 'Bağlantıyı Kes';
        btnToggle.classList.add('active');
        renderFiles(true);
        logNtfy('Bilgi', 'Obsidian MCP Vault başarıyla bağlandı. Ortak hafıza kasası yüklendi.');
      }
    });
  }
};

const initHyperframesSwarm = () => {
  const btnStart = document.getElementById('btn-start-video-swarm');
  const btnHeygen = document.getElementById('btn-heygen-toggle');
  const stagesContainer = document.getElementById('video-kanban-stages');
  
  const stages = [
    { id: 'writer', name: '1. Video Writer', desc: 'Senaryo Hazırlanıyor' },
    { id: 'editor', name: '2. Video Editor', desc: 'Kurgu & Ses Sentezi' },
    { id: 'judge', name: '3. Video Judge', desc: 'Kalite Kontrol' }
  ];

  const renderStages = (activeIndex = -1, successIndices = []) => {
    if (!stagesContainer) return;
    stagesContainer.innerHTML = stages.map((s, index) => {
      let stateClass = '';
      let statusText = 'Beklemede';
      
      if (index === activeIndex) {
        stateClass = 'active';
        statusText = s.desc;
      } else if (successIndices.includes(index)) {
        stateClass = 'success';
        statusText = 'Tamamlandı';
      }
      
      return `
        <div class="blackboard-card ${stateClass}" style="margin:0; text-align:center; padding: 0.8rem 0.5rem;">
          <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">${s.name}</span>
          <div style="font-size:0.85rem; font-weight:700; margin-top:0.25rem;">${statusText}</div>
        </div>
      `;
    }).join('');
  };

  renderStages();

  if (btnHeygen) {
    btnHeygen.addEventListener('click', () => {
      heygenActive = !heygenActive;
      if (heygenActive) {
        btnHeygen.classList.add('active');
        btnHeygen.querySelector('span').textContent = 'HeyGen Avatar: Aktif';
        logNtfy('Bilgi', 'HeyGen avatar video üretimi entegrasyonu etkinleştirildi.');
      } else {
        btnHeygen.classList.remove('active');
        btnHeygen.querySelector('span').textContent = 'HeyGen Avatar: Kapalı';
        logNtfy('Bilgi', 'HeyGen avatar video üretimi entegrasyonu devre dışı bırakıldı.');
      }
    });
  }

  if (btnStart) {
    btnStart.addEventListener('click', () => {
      if (swarmRunning) return;
      swarmRunning = true;
      btnStart.disabled = true;
      document.getElementById('video-swarm-btn-text').textContent = 'Swarm Çalışıyor...';

      const title = document.getElementById('video-swarm-title');
      const desc = document.getElementById('video-swarm-desc');

      // Writer Stage
      renderStages(0);
      if (title) title.textContent = 'Video Swarm Başlatıldı';
      if (desc) desc.textContent = 'Video Writer ajanı toptan karyola tanıtım senaryosunu oluşturuyor...';
      logNtfy('Bilgi', 'Hyperframes: Video Writer otonom senaryo yazımını başlattı.');

      // Editor Stage
      setTimeout(() => {
        renderStages(1, [0]);
        if (desc) desc.textContent = 'Video Editor ajanı kamera açılarını ve ses sentezini düzenliyor...';
        logNtfy('Bilgi', 'Hyperframes: Senaryo tamamlandı. Video Editor kurgu işlemine başladı.');
      }, 2000);

      // Judge Stage
      setTimeout(() => {
        renderStages(2, [0, 1]);
        if (desc) desc.textContent = 'Video Judge ajanı video kalitesini ve marka uyumluluğunu denetliyor...';
        logNtfy('Bilgi', 'Hyperframes: Kurgu bitti. Video Judge kalite kontrol denetimini başlattı.');
      }, 4500);

      // Verdict
      setTimeout(() => {
        renderStages(-1, [0, 1, 2]);
        const avatarText = heygenActive ? ' ve HeyGen avatar yerleşimi başarıyla tamamlandı.' : '.';
        if (title) { title.textContent = 'Video Swarm Başarıyla Sonuçlandı!'; title.style.color = 'var(--success)'; }
        if (desc) desc.textContent = `Ajanlar otonom video üretimini tamamladı. Judge kararı: "Vay, bu harika!" ${avatarText}`;
        
        const verdictBox = document.getElementById('video-swarm-verdict');
        if (verdictBox) {
          verdictBox.style.borderColor = 'var(--success)';
          verdictBox.style.background = 'rgba(74, 222, 128, 0.05)';
        }

        logNtfy('ALARM', 'Hyperframes: B2B ürün tanıtım videosu başarıyla tamamlandı ve ihraç edildi.');
        btnStart.disabled = false;
        document.getElementById('video-swarm-btn-text').textContent = 'Video Swarm Başlat';
        swarmRunning = false;
      }, 7000);
    });
  }
};

const initJarvisVoice = () => {
  const btnListen = document.getElementById('btn-jarvis-listen');
  const cmdSelect = document.getElementById('jarvis-command-select');
  const terminal = document.getElementById('jarvis-terminal');
  const waveBars = document.querySelectorAll('.voice-wave span');

  if (!btnListen || !cmdSelect || !terminal) return;

  cmdSelect.innerHTML = Object.keys(jarvisResponses).map(k => `
    <option value="${k}">${jarvisResponses[k].speech}</option>
  `).join('');

  btnListen.addEventListener('click', () => {
    const key = cmdSelect.value;
    const data = jarvisResponses[key];
    if (!data) return;

    btnListen.disabled = true;
    document.getElementById('jarvis-listen-text').textContent = 'Dinliyor...';
    waveBars.forEach(b => b.classList.add('animated'));

    const userLog = document.createElement('div');
    userLog.className = 'alert-log-entry info';
    userLog.textContent = `[Siz] ➜ "${data.speech}"`;
    terminal.appendChild(userLog);
    terminal.scrollTop = terminal.scrollHeight;

    setTimeout(() => {
      waveBars.forEach(b => b.classList.remove('animated'));
      document.getElementById('jarvis-listen-text').textContent = 'Jarvis Dinle';
      btnListen.disabled = false;

      const jarvisLog = document.createElement('div');
      jarvisLog.className = 'alert-log-entry';
      jarvisLog.style.color = 'var(--accent)';
      jarvisLog.textContent = data.response;
      terminal.appendChild(jarvisLog);
      terminal.scrollTop = terminal.scrollHeight;

      // Execute Commands
      if (key === 'optimize-token') {
        const toggle = document.getElementById('btn-headroom-toggle');
        if (toggle && !headroomActive) toggle.click();
      } else if (key === 'start-swarm') {
        const startBtn = document.getElementById('btn-start-video-swarm');
        if (startBtn) startBtn.click();
      }
    }, 2000);
  });
};

const initOptimizer = () => {
  const btnHeadroom = document.getElementById('btn-headroom-toggle');
  const txtHeadroom = document.getElementById('headroom-toggle-text');
  const markFilename = document.getElementById('markitdown-filename');
  const btnConvert = document.getElementById('btn-markitdown-convert');

  const updateDisplay = (tokens, pct) => {
    const counter = document.getElementById('token-saved-counter');
    const displayPct = document.getElementById('token-saved-pct');
    savedTokens += tokens;
    savingsPercent = Math.max(savingsPercent, pct);

    if (counter) counter.textContent = savedTokens.toLocaleString('tr-TR');
    if (displayPct) displayPct.textContent = `Maliyet Azalımı: %${savingsPercent}`;
  };

  if (btnHeadroom && txtHeadroom) {
    btnHeadroom.addEventListener('click', () => {
      headroomActive = !headroomActive;
      if (headroomActive) {
        btnHeadroom.classList.add('active');
        txtHeadroom.textContent = 'Headroom: Aktif';
        updateDisplay(15000, 30);
        logNtfy('Bilgi', 'Headroom token tasarruf eklentisi otonom olarak devreye alındı.');
      } else {
        btnHeadroom.classList.remove('active');
        txtHeadroom.textContent = 'Headroom: Kapalı';
        logNtfy('Bilgi', 'Headroom token tasarrufu pasifleştirildi.');
      }
    });
  }

  if (btnConvert && markFilename) {
    btnConvert.addEventListener('click', () => {
      const fname = markFilename.value.trim() || 'HMPLAS_B2B_Urun_Katalogu.docx';
      if (fname.includes('.')) {
        const base = fname.substring(0, fname.lastIndexOf('.'));
        const newName = `${base}.md`;
        
        btnConvert.disabled = true;
        btnConvert.textContent = 'Dönüştürülüyor...';

        setTimeout(() => {
          btnConvert.disabled = false;
          btnConvert.textContent = 'Dönüştür (.md)';
          markFilename.value = newName;
          updateDisplay(8500, 15);
          logNtfy('Bilgi', `Mark It Down: "${fname}" dosyası "${newName}" formatına dönüştürüldü.`);
        }, 1500);
      } else {
        logNtfy('Uyarı', 'Lütfen geçerli bir dosya adı girin (Örn: katalog.docx).');
      }
    });
  }
};
