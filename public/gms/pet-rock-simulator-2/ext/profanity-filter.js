(function(Scratch) {
  'use strict';

  const encode = (str) => btoa(str).split('').map((i) => String.fromCharCode(i.charCodeAt(0) + 1)).join('');
  const decode = (str) => atob(str.split('').map((i) => String.fromCharCode(i.charCodeAt(0) - 1)).join(''));

  const NAUGHTY_WORDS = [
    // ── Original English words ──
    "[oWkbx>>",
    "ZYK{[R>>",
    "ZYK{[XiwcHV>",
    "ZYO{",
    "ZYO{[YN>",
    "ZYO{[nGk[R>>",
    "ZYO{[nGk[YN>",
    "ZYO{bH:t[R>>",
    "ZYO{bH:t[YN>",
    "ZnG{eHGz[B>>",
    "ZnG{eHGz[IN>",
    "ZnWicnWz",
    "ZnWtcHWv[B>>",
    "ZnmveB>>",
    "Znm1Z3h>",
    "Znm1Z3imdx>>",
    "Znm1Z3i6",
    "Znywe3qwZh>>",
    "Zny2cYB>",
    "Zny2cYCsbX5>",
    "Zn:tcH:kb4N>",
    "Zn:tcH:5",
    "Zn:v[YJ>",
    "ZoWsb3Gs[R>>",
    "ZoWtcIOpbYR>",
    "ZoWv[3iwcHV>",
    "ZoW1eHOp[XWsdx>>",
    "ZoW1eHiwcHV>",
    "ZoW1eICqdnG1[R>>",
    "ZoW1eICteXd>",
    "Z3GzdHW1cYWvZ3imdh>>",
    "Z3iqcnN>",
    "Z3iqcnt>",
    "Z3iwZXR>",
    "Z3iw[HV>",
    "Z3mzZ3ymbnWzbx>>",
    "Z3yqeB>>",
    "Z3y2cnem",
    "Z3:kbx>>",
    "Z3:kb4O2Z3umdh>>",
    "Z3:kb4O2Z3umdoN>",
    "Z3:kb4O2Z3uqcnd>",
    "Z3:wZ3iq[R>>",
    "Z3:wZ3i6",
    "Z3:wch>>",
    "Z3:weHWz",
    "Z3:zcniwcHV>",
    "Z4Wu",
    "Z4Wvcnmm",
    "Z4WveB>>",
    "Z4WveIN>",
    "[HGocx>>",
    "[Hmk",
    "[Hmkbx>>",
    "[Hmkb3imZXR>",
    "[Hmkb3imZXS{",
    "[Hms",
    "[Hms[R>>",
    "[Hmt[H9>",
    "[H:wZ3ijZXd>",
    "[H:wd3h>",
    "[H:2Z3im",
    "[H:2Z3imZnGo",
    "[IWuZnG{dx>>",
    "[IWuZnG{d3W{",
    "[Ims[R>>",
    "[nGo",
    "[nGo[3W1",
    "[nGo[3m1",
    "[nGo[3:1",
    "[nGo[3:1dx>>",
    "[nGoeHGz[B>>",
    "[nGvcol>",
    "[nWkbx>>",
    "[nWtZ3h>",
    "[nWteHOp",
    "[nmo[3mv[x>>",
    "[nmv[3WzZnGv[x>>",
    "[oKweISqcnd>",
    "[oWk",
    "[oWkbx>>",
    "[oWkb3Wl",
    "[oWkb3WleYB>",
    "[oWkb3Wz",
    "[oWkb3Wzdx>>",
    "[oWkb3mv[x>>",
    "[oWkb3:n[h>>",
    "[oWkb4N>",
    "[oWkb4Wx",
    "[oWl[3WxZXOs[YJ>",
    "[oWs",
    "[oWsb3Wz",
    "[oWsb3Wzdx>>",
    "[oWy",
    "[3Gv[3Kicnd>",
    "[3G{bB>>",
    "[3:l[HGuch>>",
    "[3:l[HGucnm1",
    "[3:sb4Wv",
    "[3:wZ3h>",
    "[3:wbx>>",
    "[4Wq[H9>",
    "bHWmZh>>",
    "bH:vb3W6",
    "bH:wb3Wz",
    "bnGkb3G{dx>>",
    "bnGkb3G{d3W{",
    "bnGkb3:n[h>>",
    "bnGx",
    "bnWzb3:n[h>>",
    "bnmoZXKwcx>>",
    "bnmo[3WzZn:w",
    "bnm7fh>>",
    "boWv[3ymZoWvcol>",
    "b3ms[R>>",
    "b36wZnKqcnd>",
    "b3:wZ3h>",
    "b3:weHOp",
    "b4KieYR>",
    "b4ms[R>>",
    "cHW{Zn9>",
    "cHW7fnmm",
    "cXmt[h>>",
    "cXmv[3V>",
    "cX:1bHWz[oWkb3Wz",
    "cX:1bHWz[oWkb3Wzdx>>",
    "cX:1bHWz[oWkb3mv[x>>",
    "cYWn[h>>",
    "cYWn[nSqenWz",
    "cYWn[nSqenmv[x>>",
    "cYWv[3mv[x>>",
    "cYWveHWz",
    "cneoZR>>",
    "cnmoZR>>",
    "cnmo[3F>",
    "cnmo[3Wz",
    "cnmo[3Wzdx>>",
    "cnmocHW1",
    "cnmodh>>",
    "dHGsbR>>",
    "dHGvc3:kbB>>",
    "dHWkb3Wz",
    "dHWkb3WzbHWi[B>>",
    "dHmtcH:kbx>>",
    "dHm{dx>>",
    "dHm{d3Wl",
    "dH:tcH:kbx>>",
    "dH:wch>>",
    "dH:wcnGvbR>>",
    "dH:wcnGvfR>>",
    "dH:wcoSicnd>",
    "dH:zZ3iuc36s[Yl>",
    "dIKqZ3t>",
    "dIWvZX6q",
    "dIWvZX6vfR>>",
    "dIWvZX66",
    "dIW{d3mm",
    "dIW{d3mmdx>>",
    "dIW{d4l>",
    "dIW1ZR>>",
    "dIW1cx>>",
    "dYWqcR>>",
    "dnGobHWi[B>>",
    "doW{b3l>",
    "d3OpcH:v[x>>",
    "d3Ozc4Sm",
    "d3ii[x>>",
    "d3iqeB>>",
    "d3iqeHV>",
    "d3iqeHimZXR>",
    "d3iqeHimZXS{",
    "d3iqeIN>",
    "d3iqeISq[YJ>",
    "d3iqeISq[YO1",
    "d3iqeISqcnd>",
    "d3iqeIS6",
    "d3uicnt>",
    "d3um[YR>",
    "d3yi[x>>",
    "d3yicoSmfXV>",
    "d3y2eB>>",
    "d32idoSid4N>",
    "d32idoSid4Omdx>>",
    "d32m[x>>",
    "d36ieHOp",
    "d4CqZx>>",
    "d4CqZ3t>",
    "d4Ctc3:o[R>>",
    "d4Cwc3em",
    "eHWiZnGo[3mv[x>>",
    "eHm1",
    "eHm1bXW{",
    "eHm1dx>>",
    "eHm1eHmmdx>>",
    "eHm1eIl>",
    "eH:{d3Wz",
    "eH:4[Xyp[XGl",
    "eIeieB>>",
    "enmjdnG1c4J>",
    "e3Gvbx>>",
    "e3Gvb3Wz",
    "e3W1ZnGkbx>>",
    "e3iwdnV>",
    "e3m{[XG{dx>>",
    "e3m{[XG{d3W{",
    "e3:x",
    "[Hmxd3iqeB>>",
    "coWuZn62eIN>",
    "ZoWo[3Wz",
    "ZYO{bHG1",
    "ZYO{bHWi[B>>",
    "ZYO{e3mx[R>>",
    "ZYO{[oWkbx>>",
    "ZYO{[oWkb3Wz",
    "ZYO{Z3ywe35>",
    "ZYO{[nGk[R>>",
    "ZYO{cHmkb3Wz",
    "ZnG{eHGz[Hm7[R>>",
    "Znm1Z3huZYO{",
    "Znywe3qwZoN>",
    "Zn:tcH:kbx>>",
    "ZoWtcIOpbYS1[YJ>",
    "ZoWtcIOpbYS1bX6o",
    "ZoW1eHiwcHV>",
    "ZoW1eH[2Z3t>",
    "ZoW1eHimZXR>",
    "Z3:kb4N>",
    "Z3:kb4O2Z3umdh>>",
    "Z3:kb4O2Z3uqcnd>",
    "Z3:kb3imZXR>",
    "Z3:kb3[iZ3V>",
    "Z4KidB>>",
    "Z4KidIC6",
    "Z4KidICmdh>>",
    "Z4Wud3iweB>>",
    "Z4Wud3y2eB>>",
    "Z4Wud4SibX5>",
    "Z4WveIl>",
    "[HGucnm1",
    "[HGucnWl",
    "[Hmkb3imZXR>",
    "[Hmkb3[iZ3V>",
    "[Hmkb4ei[B>>",
    "[Hmkb4em[XR>",
    "[Hmt[H:{",
    "[H:2Z3imZnGodx>>",
    "[Ims[YN>",
    "[nGo[3:1dx>>",
    "[nGzeIN>",
    "[nGzeHmv[x>>",
    "[oWkb3Wzdx>>",
    "[oWkb3Wl",
    "[oWkb3imZXR>",
    "[oWkb3[iZ3V>",
    "[oWkb4eqeB>>",
    "[oWkb3KwfR>>",
    "[oWkb3eqdnx>",
    "[oWkb4O1bXOs",
    "[oWkb4Wx",
    "[3:l[HGucXm1",
    "[3:l[HGucnWl",
    "bHWtcHiwcHV>",
    "bH:uc4N>",
    "bH:zd3W{bHm1",
    "bnGkb3G{d3W{",
    "bnWzb4N>",
    "bnWzb3:n[h>>",
    "bnWzbz2w[nZ>",
    "bnm7fnWl",
    "b3ms[YN>",
    "b36wZnimZXR>",
    "b36wZh>>",
    "cHW{Zn:{",
    "cH2icx>>",
    "cH2nZX9>",
    "cX:zc36{",
    "cX:zc36qZx>>",
    "cX:1bHWz[oWkb3mv[x>>",
    "cX:1bHWz[oWkb3Wzdx>>",
    "cnmo[3G{",
    "dHm{d3Wz",
    "dHm{d3mv[x>>",
    "dHm{d3imZXR>",
    "dIKqZ3u{",
    "dIW{d3mmdx>>",
    "dnGxbYO1",
    "dnGxbYO1dx>>",
    "dnGxbX6o",
    "dnW1ZYKldx>>",
    "dnW1ZYKl[XR>",
    "d3Oz[YdhfX:2",
    "d3Oz[Ye6c4V>",
    "d3iqeIS6",
    "d3iqeISqcnd>",
    "d3iqeHimZXR>",
    "d3iqeIO1ZXmv",
    "d3iqeHiwcHV>",
    "d3iqeH[iZ3Wl",
    "d3iqeHKi[x>>",
    "d3iqeH[iZ3V>",
    "d3y2eIN>",
    "d3y2eIS6",
    "d3:vJH:nJHFhZnm1Z3h>",
    "d3:vc3[iZnm1Z3h>",
    "d3:vc3[i",
    "d4CqZ4N>",
    "eIeieIN>",
    "e3Gvb3Wz",
    "e3Gvb3Wzdx>>",
    "e3Gvb3mv[x>>",
    "e3iwdnW{",
    "e4Sn",
    // ── French ──
    "cXWz[HV>",
    "dIW1ZXmv",
    "Z3:vcnGz[B>>",
    "d3Gtc4Cm",
    "Z3:v",
    "Zn:z[HWt",
    "[nmtdzCl[TCxeYSm",
    "cXWz[HW{",
    "dIW1ZXmvdx>>",
    "d3Gtc4Cmdx>>",
    "Z3:vcnGz[IN>",
    "Z3:vcnGz[HV>",
    "[n:2eIKm",
    "bnVhcTemcjCnc4W{",
    "enFheHVh[nGqdnVh[n:2eIKm",
    "Z3iq[YJ>",
    "Z3iq[R>>",
    "Znm1[R>>",
    "Znm1[YN>",
    "Z3:vdx>>",
    "Z3:vcnV>",
    "dIW1[R>>",
    "dIW1[YN>",
    "ZnGqd3Wz",
    "cnmyeXWz",
    "cXWz[HmyeXV>",
    "eHFh[4WmeXym",
    // ── Spanish ──
    "Z3Gjdn:v",
    "bn:l[YJ>",
    "[3mtbYCwcHyidx>>",
    "bH:{eHmi",
    "dHWv[HWrcx>>",
    "Z3iqcneiJIS2JH2i[IKm",
    "dIW1ZYN>",
    "dHWv[HWrc4N>",
    "dHWv[HWrZR>>",
    "Z3Gjdn:v[YN>",
    "Z3iqcnei",
    "Z3iqcnei[HF>",
    "Z3iqcnei[H9>",
    "Z3iqcneidh>>",
    "bn:l[R>>",
    "bH:{eHmidx>>",
    "cXmmdnSi",
    "bHmrczCl[TCxeYSi",
    "enWz[3F>",
    "Z4Wt[YKw",
    "dHmvZ3im",
    "cXGuZYJ>",
    "[n:tcHGz",
    "Z3:o[YJ>",
    // ── German ──
    "[nmkb3Wv",
    "e3mkbIOmdh>>",
    "bIWz[X6{c3iv",
    "ZYK{Z3itc3Op",
    "enWz[HGucYR>",
    "[IWucXuwdHZ>",
    "d3Op[XoEo3umdnx>",
    "ZYK{Z3h>",
    "e3mkbIOmch>>",
    "bIWz[R>>",
    "bIWz[X5>",
    "[nmkbx>>",
    "[nmkb3Wv",
    "[3WnbXOseB>>",
    "d3OpcHGudHV>",
    "d3OpcHGudHWv",
    "d3Ope4WkbISmcB>>",
    "d4Cid4R>",
    "d4Cid4Sqd3Op",
    "bXSqc4R>",
    "bXSqc4Smch>>",
    "[n:1fnV>",
    "[n:1fnWv",
    "cXm{eHumdnx>",
    "en:tcHmlbX:1",
    "ZnW{Z3iqd4Omch>>",
    "[HWxdB>>",
    "[HWxdHWv",
    // ── Italian ──
    "Z3G7fn9>",
    "enGn[nGvZ4Wtcx>>",
    "d4Szc367cx>>",
    "cXmvZ3iqZR>>",
    "ZnG{eHGz[H9>",
    "[nmocHmwJHSqJIC2eISicnF>",
    // ── Portuguese ──
    "dH:zdnF>",
    "Z3GzZXypcx>>",
    "[nmtbH9h[HFhdIW1ZR>>",
    "cXWz[HF>",
    "[n:lZT2{[R>>",
    // ── Dutch ──
    "[Xms[Xx>",
    "[3:lenWz[H:ucXV>",
    "b3ywc4S7ZXt>",
    "b3Gvb3Wz",
    "bH:mdh>>",
    "cIWt",
    "b4W1",
    "b4W1eHWv",
    "b4W1bnV>",
    "cIWtcHWv",
    "cIWtcHW1bnV>",
    "[Xms[Xy{",
    "d3ymeB>>",
    "d3ymeISmch>>",
    "bH:mdnWv",
    "eHWzbX6o",
    "[3:lenWz",
    "b3ywc4S7ZXus[X5>",
    "ZXOpeHWzcHmrbx>>",
    "d4Szc361",
    "d4Szc361fnGs",
    "d3OpbXq1",
    "d3OpbXq1[YKl",
    "cnW2b3Wv",
    "cnW2bx>>",
    "dHms",
    "dHmsb3Wv",
    "dnWmeB>>",
    "dnWmeHqm",
    "eImneYN>",
    "eImneYOtbXqmdh>>",
    "cX:n",
    "cX:n[nWv",
    "cnmsb3Wz",
    "cnmsb3Wzdx>>",
    "dH:mdB>>",
    "dH:mdHWv",
    "b3:veHeieB>>",
    "b3:veB>>",
    "fnGsb3Wve3G{d3Wz",
    "[nyqb3umdh>>",
    "[nyqb3umdoN>",
    "eoWqcHV>",
    "eoWqcB>>",
    "[HWjbXWt",
    "[HWjbXWt[X5>",
    "bXSqc3:1",
    "bXSqc4Smch>>",
    "cX:v[3:wcB>>",
    "cX:v[3:t[X5>",
    "bH:mdnWvfn:wch>>",
    "d3:l[X2q[YSmdh>>",
    "d3:l[X2q[YSmdoN>",
    "enWz[H:ucXV>",
    "b3Gvb3WzcX:v[3:wcB>>",
    "b3Gvb3Wzd4S2eB>>",
    // ── Russian ──
    "Zny6ZXR>",
    "dHm7[HF>",
    "fXWjZYR>",
    "b3i2fR>>",
    "d4WsZR>>",
    "cYWlZXt>",
    // ── Polish ──
    "b4Wze3F>",
    "Z3i2bh>>",
    "d3u2doe6d4mv",
    "[IWxZR>>",
    // ── Swedish ──
    "bHWtenW1[R>>",
    "[nm1eHF>",
    "b362cHyi",
    "bH:zZR>>",
    "d3uqeB>>",
    // ── Japanese ──
    "b3mkbHmseR>>",
    "b4W{cx>>",
    "Z3iqb4W{bH9>",
    "ZnGsZR>>",
    // ── Arabic ──
    "b4W{dx>>",
    "bH2idh>>",
    // ── Turkish ──
    "c4Kwd4C2",
    "d3mseHmz",
    "c4Kwd4C2JHOwZ4WoeR>>",
    // ── Hindi ──
    "cXGlZYKkbH:l",
    "ZnWp[X6kbH:l",
    "[3GicnR>",
    "Z3i2eHm6ZR>>",
    "bHGzZX2q",
    "d3GicHF>",
    // ── Greek ──
    "cXGtZXui",
    "[3Guc4Sw",
    "d3uieHF>",
    // ── Finnish ──
    "dHWzb3Wt[R>>",
    "enm1eIV>",
    "dHG{b3F>",
    "d3GieHGvZR>>",
    // ── Czech / Slovak ──
    "b4WzenF>",
    "bH:3cn9>",
    "bnWjZYR>",
    // ── Romanian ──
    "dIWtZR>>",
    "Z3GkZYR>",
    "cYWq[R>>",
    "[oW1eYR>",
    // ── Hungarian ──
    "ZnG{fnRhcXWo",
    "[nG{fh>>",
    // ── Korean ──
    "d3iqZnGt",
    "cXmkbHmv",
    // ── Mandarin ──
    "eHGuZXSm",
    "d3iiZnl>",
    "Z3GwJH6qJH2i",
    "e3Gv[3KiJHSich>>",
  ];

  // ── Decode words safely, skipping any that fail ──
  const decodedWords = [];
  for (const w of NAUGHTY_WORDS) {
    try {
      const d = decode(w);
      if (d && d.length > 0) decodedWords.push(d);
    } catch (e) {
      // skip bad entries silently
    }
  }

  const uniqueWords = [...new Set(decodedWords)];
  uniqueWords.sort((a, b) => b.length - a.length);

  // ── Build regex lazily with a safe fallback ──
  let _regex = null;
  function getRegex() {
    if (!_regex) {
      try {
        const escaped = uniqueWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        _regex = new RegExp(escaped.join('|'), 'gi');
      } catch (e) {
        console.warn('Bad Word Remover: regex build failed, using safe fallback.', e);
        _regex = /(?!)/; // matches nothing — extension still loads cleanly
      }
    }
    _regex.lastIndex = 0;
    return _regex;
  }

  class Profanity {
    getInfo() {
      return {
        id: 'theshovelprofanity',
        name: 'Bad Word Remover',
        color1: '#cf6a3c',
        color2: '#cf6a3c',
        color3: '#cf6a3c',
        blocks: [
          // ── Detection ──
          {
            opcode: 'containsProfanity',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'does [TEXT] contain bad words?',
            arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello!' } }
          },
          {
            opcode: 'countProfanity',
            blockType: Scratch.BlockType.REPORTER,
            text: 'count bad words in [TEXT]',
            arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello!' } }
          },
          {
            opcode: 'listProfanity',
            blockType: Scratch.BlockType.REPORTER,
            text: 'list bad words found in [TEXT]',
            arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello!' } }
          },
          { blockType: Scratch.BlockType.LABEL, text: 'Replacement' },
          {
            opcode: 'checkProfanity',
            blockType: Scratch.BlockType.REPORTER,
            text: 'replace bad words in [TEXT] with [REPLACEMENT]',
            arguments: {
              REPLACEMENT: { type: Scratch.ArgumentType.STRING, defaultValue: '***' },
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello!' }
            }
          },
          {
            opcode: 'censorProfanity',
            blockType: Scratch.BlockType.REPORTER,
            text: 'censor bad words in [TEXT] keeping first [KEEP] letters',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello!' },
              KEEP: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'starProfanity',
            blockType: Scratch.BlockType.REPORTER,
            text: 'replace each letter of bad words in [TEXT] with [CHAR]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello!' },
              CHAR: { type: Scratch.ArgumentType.STRING, defaultValue: '*' }
            }
          },
          { blockType: Scratch.BlockType.LABEL, text: 'Utilities' },
          {
            opcode: 'wordCount',
            blockType: Scratch.BlockType.REPORTER,
            text: 'number of bad words in dictionary',
            arguments: {}
          },
          {
            opcode: 'firstBadWord',
            blockType: Scratch.BlockType.REPORTER,
            text: 'first bad word found in [TEXT]',
            arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello!' } }
          },
          {
            opcode: 'cleanIfBad',
            blockType: Scratch.BlockType.REPORTER,
            text: 'if [TEXT] contains bad words return [BAD] else return [GOOD]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello!' },
              BAD: { type: Scratch.ArgumentType.STRING, defaultValue: 'blocked' },
              GOOD: { type: Scratch.ArgumentType.STRING, defaultValue: 'allowed' }
            }
          },
        ]
      };
    }

    containsProfanity({ TEXT }) {
      try { return getRegex().test(String(TEXT)); } catch(e) { return false; }
    }

    countProfanity({ TEXT }) {
      try {
        const matches = String(TEXT).match(getRegex());
        return matches ? matches.length : 0;
      } catch(e) { return 0; }
    }

    listProfanity({ TEXT }) {
      try {
        const matches = String(TEXT).match(getRegex());
        return matches ? [...new Set(matches.map(m => m.toLowerCase()))].join(', ') : '';
      } catch(e) { return ''; }
    }

    checkProfanity({ TEXT, REPLACEMENT }) {
      try { return String(TEXT).replace(getRegex(), () => REPLACEMENT); } catch(e) { return String(TEXT); }
    }

    censorProfanity({ TEXT, KEEP }) {
      try {
        const keep = Math.max(0, Math.floor(Number(KEEP)));
        return String(TEXT).replace(getRegex(), (match) =>
          match.slice(0, keep) + '*'.repeat(Math.max(0, match.length - keep))
        );
      } catch(e) { return String(TEXT); }
    }

    starProfanity({ TEXT, CHAR }) {
      try {
        const ch = String(CHAR).charAt(0) || '*';
        return String(TEXT).replace(getRegex(), (match) => ch.repeat(match.length));
      } catch(e) { return String(TEXT); }
    }

    wordCount() {
      return uniqueWords.length;
    }

    firstBadWord({ TEXT }) {
      try {
        const match = String(TEXT).match(getRegex());
        return match ? match[0] : '';
      } catch(e) { return ''; }
    }

    cleanIfBad({ TEXT, BAD, GOOD }) {
      try { return getRegex().test(String(TEXT)) ? BAD : GOOD; } catch(e) { return GOOD; }
    }
  }

  Scratch.extensions.register(new Profanity());
})(Scratch);
