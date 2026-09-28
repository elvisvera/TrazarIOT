/**
 * ============================================================================
 * AGROMONITOR PRO - APLICACIÓN PRINCIPAL
 * CON MAPA, ANÁLISIS TÉRMICO, DE HUMEDAD Y REPORTES
 * VERSIÓN COMPLETA - CORRECCIÓN UTM ZONA 17S
 * ============================================================================
 */

// ============================================================================
// CONFIGURACIÓN DE ESTACIONES
// ============================================================================
const ESTACIONES = {
    'Parcela LONYA': {
        channel_id: null,
        api_key: null,
        color: '#FF8C00',
        colorPastel: 'rgba(255, 140, 0, 0.45)',
        colorLight: 'rgba(255, 140, 0, 0.20)',
        colorLightPastel: 'rgba(255, 140, 0, 0.14)',
        colorDark: '#D2691E',
        colorGradient: 'linear-gradient(135deg, #FF8C00, #D2691E)',
        cultivo: 'cafe',
        ubicacion: 'Parcela LONYA',
        emoji: '📍',
        este: 786075,
        norte: 9323892,
        altura: 1574,
        lugar: 'LONYA',
        isVirtual: true
    },
    'Estación 3 Señor Andrez': {
        channel_id: '3348796',
        api_key: 'AVFRAOD9F9ZUH0EW',
        color: '#800000',
        colorPastel: 'rgba(231, 76, 60, 0.45)',
        colorLight: 'rgba(231, 76, 60, 0.20)',
        colorLightPastel: 'rgba(231, 76, 60, 0.14)',
        colorDark: '#C0392B',
        colorGradient: 'linear-gradient(135deg, #E74C3C, #C0392B)',
        cultivo: 'cafe',
        ubicacion: 'Campo 3 - Café',
        emoji: '📍',
        este: 794382,
        norte: 9310680,
        altura: 1700,
        lugar: 'Señor Andrez'
    },
    'Estación 4 Laguna de los cóndores': {
        channel_id: '3326229',
        api_key: 'I5W63WYA3UN0R7E1',
        color: '#F4A460',
        colorPastel: 'rgba(52, 152, 219, 0.45)',
        colorLight: 'rgba(52, 152, 219, 0.20)',
        colorLightPastel: 'rgba(52, 152, 219, 0.14)',
        colorDark: '#2980B9',
        colorGradient: 'linear-gradient(135deg, #3498DB, #2980B9)',
        cultivo: 'cafe',
        ubicacion: 'Campo 4 - Café',
        emoji: '📍',
        este: 839698,
        norte: 9312625,
        altura: 2203,
        lugar: 'Laguna de los cóndores'
    },
    'Estación 1 Néstor Jiménez': {
        channel_id: '3255217',
        api_key: 'QI1XODVEJBWJ82R0',
        color: '#BC8F8F',
        colorPastel: 'rgba(46, 204, 113, 0.45)',
        colorLight: 'rgba(46, 204, 113, 0.20)',
        colorLightPastel: 'rgba(46, 204, 113, 0.14)',
        colorDark: '#27AE60',
        colorGradient: 'linear-gradient(135deg, #2ECC71, #27AE60)',
        cultivo: 'cacao',
        ubicacion: 'Campo 1 - Cacao',
        emoji: '📍',
        este: 792406,
        norte: 9364085,
        altura: 650,
        lugar: 'Néstor Jiménez'
    },
    'Estación 2 IRENE': {
        channel_id: '3010530',
        api_key: 'T5KKTEXWHCUX5P0J',
        color: '#D2691E',
        colorPastel: 'rgba(155, 89, 182, 0.45)',
        colorLight: 'rgba(155, 89, 182, 0.20)',
        colorLightPastel: 'rgba(155, 89, 182, 0.14)',
        colorDark: '#8E44AD',
        colorGradient: 'linear-gradient(135deg, #9B59B6, #8E44AD)',
        cultivo: 'cacao',
        ubicacion: 'Campo 2 - Cacao',
        emoji: '📍',
        este: 788414,
        norte: 9360891,
        altura: 449,
        lugar: 'IRENE'
    }
};

// ============================================================================
// CONFIGURACIÓN DE CULTIVOS
// ============================================================================
const CULTIVOS = {
    cafe: {
        nombre: 'Café',
        icono: '☕',
        gddTotal: 2836,
        tempOptima: 21,
        tempMax: 28,
        tempMin: 15,
        humedadOptima: 70,
        etapas: [
            { nombre: 'Crecimiento Vegetativo', rango: [0, 800], icono: '🌱' },
            { nombre: 'Inducción Floral', rango: [800, 1200], icono: '🌿' },
            { nombre: 'Floración', rango: [1200, 1800], icono: '🌸' },
            { nombre: 'Maduración', rango: [1800, 2836], icono: '🍒' },
            { nombre: 'Cosecha', rango: [2836, Infinity], icono: '☕' }
        ]
    },
    cacao: {
        nombre: 'Cacao',
        icono: '🌰',
        gddTotal: 2836,
        tempOptima: 24,
        tempMax: 30,
        tempMin: 18,
        humedadOptima: 80,
        etapas: [
            { nombre: 'Crecimiento Vegetativo', rango: [0, 600], icono: '🌱' },
            { nombre: 'Inducción Floral', rango: [600, 1000], icono: '🌿' },
            { nombre: 'Floración', rango: [1000, 1600], icono: '🌸' },
            { nombre: 'Desarrollo de Frutos', rango: [1600, 2400], icono: '🌰' },
            { nombre: 'Maduración', rango: [2400, 2836], icono: '🍫' },
            { nombre: 'Cosecha', rango: [2836, Infinity], icono: '🌰' }
        ]
    }
};

// ============================================================================
// CONFIGURACIÓN GLOBAL
// ============================================================================
const CONFIG = {
    INTERVALO_ACTUALIZACION: 600000,
    DIAS_ANALISIS: 10,
    UMBRALES: {
        gddTotal: 2836,
        tempOptima: 21,
        tempMax: 28,
        helada: 8,
        humedadOptima: 70,
        radiacionMax: 1000
    }
};

// ============================================================================
// ESTADO GLOBAL
// ============================================================================
let state = {
    estaciones: {},
    alertas: [],
    isLoading: false,
    chartInstances: {},
    ultimaActualizacion: null,
    datosHorarios: {},
    termico: {
        estacionSeleccionada: null,
        datos: null,
        vpdDatos: null,
        chartInstances: {}
    },
    humedad: {
        estacionSeleccionada: null,
        datos: null,
        chartInstances: {}
    }
};

// ============================================================================
// DOM REFERENCIAS
// ============================================================================
const DOM = {
    kpiGDD: document.getElementById('kpiGDD'),
    kpiGDDSub: document.getElementById('kpiGDDSub'),
    kpiCalidad: document.getElementById('kpiCalidad'),
    kpiCalidadSub: document.getElementById('kpiCalidadSub'),
    kpiBalance: document.getElementById('kpiBalance'),
    kpiBalanceSub: document.getElementById('kpiBalanceSub'),
    kpiAlertas: document.getElementById('kpiAlertas'),
    kpiAlertasSub: document.getElementById('kpiAlertasSub'),
    cafeCalidad: document.getElementById('cafeCalidad'),
    cafeGDD: document.getElementById('cafeGDD'),
    cacaoCalidad: document.getElementById('cacaoCalidad'),
    cacaoGDD: document.getElementById('cacaoGDD'),
    alertasContainer: document.getElementById('alertasContainer'),
    alertaBadge: document.getElementById('alertaBadge'),
    ultimaActualizacion: document.getElementById('ultimaActualizacion'),
    btnRefresh: document.getElementById('btnRefresh'),
    periodSelector: document.getElementById('periodSelector'),
    estacionesGrid: document.getElementById('estacionesGrid'),
    fenologicoGrid: document.getElementById('fenologicoGrid'),
    calidadGrid: document.getElementById('calidadGrid'),
    mainChart: document.getElementById('mainChart'),
    scatterChart: document.getElementById('scatterChart'),
    altitudTempChart: document.getElementById('altitudTempChart'),
    altitudHumChart: document.getElementById('altitudHumChart'),
    lonyaChart: document.getElementById('lonyaChart'),
    pageTitle: document.getElementById('pageTitle'),
    pageSubtitle: document.getElementById('pageSubtitle'),
    
    termicoEstacionSelector: document.getElementById('termicoEstacionSelector'),
    termicoPeriodSelector: document.getElementById('termicoPeriodSelector'),
    termicoBtnRefresh: document.getElementById('termicoBtnRefresh'),
    termicoStatMax: document.getElementById('termicoStatMax'),
    termicoStatMaxFecha: document.getElementById('termicoStatMaxFecha'),
    termicoStatMin: document.getElementById('termicoStatMin'),
    termicoStatMinFecha: document.getElementById('termicoStatMinFecha'),
    termicoStatAvg: document.getElementById('termicoStatAvg'),
    termicoStatAvgSub: document.getElementById('termicoStatAvgSub'),
    termicoStatNight: document.getElementById('termicoStatNight'),
    termicoStatNightSub: document.getElementById('termicoStatNightSub'),
    termicoStatAmplitude: document.getElementById('termicoStatAmplitude'),
    termicoStatAmplitudeSub: document.getElementById('termicoStatAmplitudeSub'),
    termicoInfoEstacion: document.getElementById('termicoInfoEstacion'),
    termicoTableInfo: document.getElementById('termicoTableInfo'),
    termicoTableBody: document.getElementById('termicoTableBody'),
    termicoAvgChart: document.getElementById('termicoAvgChart'),
    termicoNightChart: document.getElementById('termicoNightChart'),
    termicoVpdChart: document.getElementById('termicoVpdChart'),
    termicoVpdAlertasChart: document.getElementById('termicoVpdAlertasChart'),

    humedadEstacionSelector: document.getElementById('humedadEstacionSelector'),
    humedadPeriodSelector: document.getElementById('humedadPeriodSelector'),
    humedadBtnRefresh: document.getElementById('humedadBtnRefresh'),
    humedadStatMax: document.getElementById('humedadStatMax'),
    humedadStatMaxFecha: document.getElementById('humedadStatMaxFecha'),
    humedadStatMin: document.getElementById('humedadStatMin'),
    humedadStatMinFecha: document.getElementById('humedadStatMinFecha'),
    humedadStatAvg: document.getElementById('humedadStatAvg'),
    humedadStatAvgSub: document.getElementById('humedadStatAvgSub'),
    humedadStatRange: document.getElementById('humedadStatRange'),
    humedadStatRangeSub: document.getElementById('humedadStatRangeSub'),
    humedadStatExceso: document.getElementById('humedadStatExceso'),
    humedadStatExcesoSub: document.getElementById('humedadStatExcesoSub'),
    humedadInfoEstacion: document.getElementById('humedadInfoEstacion'),
    humedadTableInfo: document.getElementById('humedadTableInfo'),
    humedadTableBody: document.getElementById('humedadTableBody'),
    humedadAvgChart: document.getElementById('humedadAvgChart'),
    humedadMinMaxChart: document.getElementById('humedadMinMaxChart'),
    humedadDistChart: document.getElementById('humedadDistChart'),
    humedadHoras90Chart: document.getElementById('humedadHoras90Chart'),
    humedadPuntoRocioChart: document.getElementById('humedadPuntoRocioChart')
};

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================
function formatNumber(val, decimals = 1) {
    return Number(val).toFixed(decimals);
}

function formatDate(date) {
    return moment(date).format('DD/MM/YYYY HH:mm');
}

function formatShortDate(date) {
    return moment(date).format('DD MMM');
}

function formatTime(date) {
    return moment(date).format('HH:mm');
}

function formatDateOnly(date) {
    return moment(date).format('DD/MM/YYYY');
}

function formatDateInput(date) {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function parseDateInput(value) {
    if (!value) return null;
    const [year, month, day] = String(value).split('-').map(Number);
    if (!year || !month || !day) return null;
    const parsed = new Date(year, month - 1, day);
    return isNaN(parsed.getTime()) ? null : parsed;
}

function getDashboardColors(est) {
    return {
        color: est.colorPastel || est.color,
        colorLight: est.colorLightPastel || est.colorLight
    };
}

function average(values) {
    if (!Array.isArray(values) || values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// ============================================================================
// API - OBTENCIÓN DE DATOS
// ============================================================================
function generarDatosFallback(estacion, dias = 10) {
    if (!estacion) return [];

    const now = new Date();
    const totalPuntos = Math.max(24, dias * 24);
    const datos = [];
    const baseTemp = estacion.cultivo === 'cafe' ? 21.8 : 24.2;
    const tempAmplitude = estacion.altura > 1500 ? 3.2 : 4.8;
    const baseHumedad = estacion.cultivo === 'cafe' ? 68 : 74;

    for (let i = totalPuntos; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hora = timestamp.getHours();
        const isDay = hora >= 6 && hora <= 18;
        const sinusoidal = Math.sin((hora / 24) * (Math.PI * 2));
        const dailyWave = Math.sin(((i / 24) * Math.PI) / 1.8);

        const temperatura = Math.max(8, Math.min(38,
            baseTemp + sinusoidal * tempAmplitude + dailyWave * 1.6 + (estacion.altura > 1500 ? -1.2 : 0.8)
        ));

        const humedad = Math.max(30, Math.min(98,
            baseHumedad + (isDay ? -10 : 8) + Math.sin((i / 12) * Math.PI) * 12
        ));

        const precipitacion = (hora === 7 || hora === 18) && ((i % 8) === 0) ? 0.8 + (i % 3) * 0.3 : 0;
        const radiacion = isDay ? 450 + (Math.sin((hora - 6) / 12 * Math.PI) * 500) + (i % 5) * 50 : 30 + (i % 4) * 12;

        datos.push({
            timestamp,
            temperatura: Number(temperatura.toFixed(1)),
            humedad: Number(humedad.toFixed(1)),
            precipitacion: Number(precipitacion.toFixed(2)),
            radiacion: Number(Math.max(0, radiacion).toFixed(1))
        });
    }

    return datos;
}

async function fetchStationData(channelId, apiKey, dias = 10, startDate = null, endDate = null) {
    if (!channelId) {
        return [];
    }

    const estacionConfig = Object.values(ESTACIONES).find(est => String(est.channel_id) === String(channelId));
    const fechaFin = endDate ? new Date(endDate) : new Date();
    const fechaInicio = startDate ? new Date(startDate) : (() => {
        const date = new Date(fechaFin);
        date.setDate(date.getDate() - dias);
        return date;
    })();

    const fetchChunk = async (inicio, fin, nivel = 0) => {
        const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json`;
        const params = new URLSearchParams({
            api_key: apiKey,
            start: inicio.toISOString(),
            end: fin.toISOString(),
            results: 8000
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            const response = await fetch(`${url}?${params}`, { signal: controller.signal });
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const data = await response.json();
            const feeds = Array.isArray(data?.feeds) ? data.feeds : [];
            return feeds.map(feed => ({
                timestamp: new Date(feed.created_at),
                temperatura: parseFloat(feed.field1) || 0,
                humedad: parseFloat(feed.field2) || 0,
                precipitacion: parseFloat(feed.field3) || 0,
                radiacion: parseFloat(feed.field4) || 0
            }));
        } catch (error) {
            if (error.name === 'AbortError') {
                console.warn(`Tiempo de espera agotado para estación ${channelId}; usando respaldo local.`);
            } else {
                console.error(`Error en estación ${channelId}:`, error);
            }
            return [];
        } finally {
            clearTimeout(timeoutId);
        }
    };

    const fetchRangeCompleto = async (inicio, fin, nivel = 0) => {
        const datos = await fetchChunk(inicio, fin, nivel);
        if (!datos.length) {
            return [];
        }

        const diffDays = Math.max(1, Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)));
        if (datos.length >= 8000 && diffDays > 1 && nivel < 8) {
            const mitad = new Date(inicio.getTime() + ((fin.getTime() - inicio.getTime()) / 2));
            const izquierda = await fetchRangeCompleto(inicio, mitad, nivel + 1);
            const derecha = await fetchRangeCompleto(mitad, fin, nivel + 1);
            const combinado = [...izquierda, ...derecha];
            const unique = new Map();
            combinado.forEach(item => {
                const key = item.timestamp.getTime();
                if (!unique.has(key)) unique.set(key, item);
            });
            return Array.from(unique.values()).sort((a, b) => a.timestamp - b.timestamp);
        }

        return datos;
    };

    try {
        const datos = await fetchRangeCompleto(fechaInicio, fechaFin);
        if (datos.length === 0 && estacionConfig) {
            console.warn(`No hubo datos reales para ${channelId}; usando respaldo local.`);
            return generarDatosFallback(estacionConfig, dias);
        }
        return datos;
    } catch (error) {
        if (estacionConfig) {
            console.warn(`Fallo al obtener datos reales para ${channelId}; usando respaldo local.`);
            return generarDatosFallback(estacionConfig, dias);
        }
        return [];
    }
}

// ============================================================================
// CÁLCULO DE REGRESIÓN LINEAL PARA EXTRAPOLACIÓN
// ============================================================================
function calcularRegresionLinealPorAltitud(puntos) {
    const n = puntos.length;
    if (n < 2) return { slope: 0, intercept: 0, correlation: 0 };

    const xMean = average(puntos.map(p => p.x));
    const yMean = average(puntos.map(p => p.y));
    const numerator = puntos.reduce((acc, p) => acc + (p.x - xMean) * (p.y - yMean), 0);
    const denominatorX = puntos.reduce((acc, p) => acc + Math.pow(p.x - xMean, 2), 0);
    const denominatorY = puntos.reduce((acc, p) => acc + Math.pow(p.y - yMean, 2), 0);

    const slope = denominatorX === 0 ? 0 : numerator / denominatorX;
    const intercept = yMean - slope * xMean;
    const correlation = denominatorX === 0 || denominatorY === 0 ? 0 : numerator / Math.sqrt(denominatorX * denominatorY);

    return { slope, intercept, correlation };
}

function construirDatosExtrapoladosLonya(data, maxPoints = 1008) {
    const referencias = Object.values(data).filter(est => !est.isVirtual && Array.isArray(est.horarios) && est.horarios.length > 0);
    if (referencias.length < 2) {
        return { horarios: [], correlation: [] };
    }

    const sampleCount = Math.min(maxPoints, ...referencias.map(est => est.horarios.length));
    const baseSeries = referencias[0].horarios.slice(-sampleCount);
    const horarios = [];
    const correlations = [];

    for (let i = 0; i < sampleCount; i++) {
        const timestamp = baseSeries[i]?.timestamp || new Date();
        const row = { timestamp, temperatura: 0, humedad: 0, precipitacion: 0, radiacion: 0, correlacionAltitud: 0 };

        ['temperatura', 'humedad', 'precipitacion', 'radiacion'].forEach(key => {
            const puntos = referencias
                .map(est => ({
                    x: est.altura || 0,
                    y: est.horarios?.slice(-sampleCount)?.[i]?.[key]
                }))
                .filter(p => Number.isFinite(p.y));

            if (puntos.length >= 2) {
                const regresion = calcularRegresionLinealPorAltitud(puntos);
                let valor = regresion.slope * 1574 + regresion.intercept;

                if (key === 'humedad') {
                    valor = Math.max(0, Math.min(100, valor));
                } else if (key === 'precipitacion' || key === 'radiacion') {
                    valor = Math.max(0, valor);
                }

                row[key] = valor;
                row.correlacionAltitud = regresion.correlation;
            }
        });

        horarios.push(row);
        correlations.push(row.correlacionAltitud);
    }

    return { horarios, correlation: correlations };
}

// ============================================================================
// CÁLCULO DE INDICADORES DIARIOS
// ============================================================================
function calcularIndicadoresDiarios(datos) {
    if (!datos || datos.length === 0) return null;
    
    const horarios = datos.map(d => ({
        timestamp: d.timestamp,
        temperatura: d.temperatura,
        humedad: d.humedad,
        precipitacion: d.precipitacion,
        radiacion: d.radiacion
    }));
    
    const diario = {};
    datos.forEach(d => {
        const key = d.timestamp.toDateString();
        if (!diario[key]) {
            diario[key] = { temps: [], humedades: [], precip: 0, radiacion: 0, radiacionCount: 0, count: 0 };
        }
        diario[key].temps.push(d.temperatura);
        diario[key].humedades.push(d.humedad);
        diario[key].precip += d.precipitacion;
        if (typeof d.radiacion === 'number' && d.radiacion > 0) {
            diario[key].radiacion += d.radiacion;
            diario[key].radiacionCount += 1;
        }
        diario[key].count++;
    });
    
    const diarioArray = Object.keys(diario).map(key => {
        const d = diario[key];
        const tempMax = Math.max(...d.temps);
        const tempMin = Math.min(...d.temps);
        const tempMean = d.temps.reduce((a, b) => a + b, 0) / d.temps.length;
        const humedadMax = Math.max(...d.humedades);
        const humedadMin = Math.min(...d.humedades);
        const humedadMean = d.humedades.reduce((a, b) => a + b, 0) / d.humedades.length;
        const radiacionMean = d.radiacionCount > 0 ? d.radiacion / d.radiacionCount : 0;
        const radiacionMJ = radiacionMean * 0.0864 / 1000;
        
        const gdd = Math.max(0, (tempMax + tempMin) / 2 - 10);
        const eto = 0.0023 * Math.sqrt(tempMax - tempMin) * (tempMean + 17.8) * radiacionMJ;
        const etc = eto * 1.1;
        const balance = d.precip - etc;
        
        return {
            fecha: new Date(key),
            tempMax, tempMin, tempMean, humedadMax, humedadMin, humedadMean,
            precipitacion: d.precip,
            radiacionMean, radiacionMJ,
            gdd, gddAcumulado: 0,
            eto, etc, balance, balanceAcumulado: 0
        };
    });
    
    diarioArray.sort((a, b) => a.fecha - b.fecha);
    
    let gddAcum = 0, balanceAcum = 0;
    diarioArray.forEach(d => {
        gddAcum += d.gdd;
        balanceAcum += d.balance;
        d.gddAcumulado = gddAcum;
        d.balanceAcumulado = balanceAcum;
    });
    
    return { diario: diarioArray, horarios };
}

// ============================================================================
// CÁLCULO DE CALIDAD PREDICTIVA
// ============================================================================
function calcularCalidad(diario, gddActual, cultivo) {
    if (!diario || diario.length === 0) return null;
    
    const config = CULTIVOS[cultivo] || CULTIVOS.cafe;
    const tempProm = diario.reduce((sum, d) => sum + d.tempMean, 0) / diario.length;
    const humedadProm = diario.reduce((sum, d) => sum + d.humedadMean, 0) / diario.length;
    
    const optTemp = 1 - Math.abs(tempProm - config.tempOptima) / config.tempOptima;
    let factorTermico = 1 + Math.max(0, optTemp - 0.7) * 2.5;
    factorTermico = Math.min(1.5, factorTermico);
    
    let factorHidrico = 1 + (config.humedadOptima - humedadProm) * 0.02;
    factorHidrico = Math.max(0.5, Math.min(1.5, factorHidrico));
    
    const gddPct = gddActual / config.gddTotal;
    let factorMadurez = 1 + gddPct * 0.3;
    factorMadurez = Math.min(1.3, factorMadurez);
    
    const pq = (factorTermico * 0.4 + factorHidrico * 0.3 + factorMadurez * 0.3) * 70;
    
    let categoria, clase;
    if (pq >= 85) { categoria = 'Excelente Calidad'; clase = 'excelente'; }
    else if (pq >= 70) { categoria = 'Buena Calidad'; clase = 'bueno'; }
    else if (pq >= 55) { categoria = 'Calidad Regular'; clase = 'regular'; }
    else { categoria = 'Calidad Estándar'; clase = 'regular'; }
    
    const perfil = {
        acidez: tempProm < config.tempOptima - 2 ? 'Alta' : 
               tempProm < config.tempOptima + 1 ? 'Media-Alta' : 'Media',
        cuerpo: humedadProm > config.humedadOptima + 5 ? 'Completo' : 
                humedadProm > config.humedadOptima - 5 ? 'Medio' : 'Ligero',
        aroma: gddActual > 2000 ? 'Intenso' : gddActual > 1500 ? 'Frutal' : 'Floral',
        dulzor: gddActual > 1800 ? 'Alto' : 'Medio'
    };
    
    return { pq, categoria, clase, factores: { termico: factorTermico, hidrico: factorHidrico, madurez: factorMadurez }, perfil };
}

// ============================================================================
// DETERMINAR ETAPA FENOLÓGICA
// ============================================================================
function determinarEtapa(gdd, cultivo) {
    const config = CULTIVOS[cultivo] || CULTIVOS.cafe;
    for (const etapa of config.etapas) {
        if (gdd >= etapa.rango[0] && gdd < etapa.rango[1]) {
            return etapa;
        }
    }
    return config.etapas[config.etapas.length - 1];
}

// ============================================================================
// GENERAR ALERTAS
// ============================================================================
function generarAlertas(nombre, datos, diario, gddActual, cultivo) {
    const alertas = [];
    const ultimo = datos[datos.length - 1];
    const ultimoDiario = diario[diario.length - 1];
    const config = CULTIVOS[cultivo] || CULTIVOS.cafe;
    
    if (!ultimo || !ultimoDiario) return alertas;
    
    if (ultimoDiario.tempMin < CONFIG.UMBRALES.helada) {
        alertas.push({
            estacion: nombre, cultivo,
            tipo: 'HELADA', nivel: 'CRÍTICO', icono: '❄️',
            mensaje: `Temperatura mínima de ${formatNumber(ultimoDiario.tempMin)}°C`,
            recomendacion: 'Proteger el cultivo con cobertores',
            clase: 'critical'
        });
    }
    
    if (ultimo.temperatura > config.tempMax) {
        alertas.push({
            estacion: nombre, cultivo,
            tipo: 'ESTRÉS TÉRMICO', nivel: 'ALTO', icono: '🔥',
            mensaje: `Temperatura de ${formatNumber(ultimo.temperatura)}°C`,
            recomendacion: 'Activar riego por aspersión',
            clase: 'warning'
        });
    }
    
    if (ultimoDiario.balanceAcumulado < -15) {
        alertas.push({
            estacion: nombre, cultivo,
            tipo: 'DÉFICIT HÍDRICO CRÍTICO', nivel: 'CRÍTICO', icono: '🔴',
            mensaje: `Déficit de ${formatNumber(ultimoDiario.balanceAcumulado)} mm`,
            recomendacion: 'ACTIVAR RIEGO DE EMERGENCIA',
            clase: 'critical'
        });
    } else if (ultimoDiario.balanceAcumulado < -5) {
        alertas.push({
            estacion: nombre, cultivo,
            tipo: 'DÉFICIT HÍDRICO MODERADO', nivel: 'MODERADO', icono: '🟡',
            mensaje: `Déficit de ${formatNumber(ultimoDiario.balanceAcumulado)} mm`,
            recomendacion: 'Programar riego en 24-48 horas',
            clase: 'warning'
        });
    }
    
    if (ultimo.radiacion > CONFIG.UMBRALES.radiacionMax) {
        alertas.push({
            estacion: nombre, cultivo,
            tipo: 'EXCESO DE RADIACIÓN', nivel: 'ADVERTENCIA', icono: '☀️',
            mensaje: `Radiación de ${formatNumber(ultimo.radiacion, 0)} W/m²`,
            recomendacion: 'Considerar sombreado temporal',
            clase: 'warning'
        });
    }
    
    if (cultivo === 'cafe') {
        let diasRiesgo = 0;
        for (let i = datos.length - 1; i >= Math.max(0, datos.length - 7); i--) {
            if (datos[i].temperatura >= 21 && datos[i].temperatura <= 25 && datos[i].humedad >= 80) {
                diasRiesgo++;
            } else {
                break;
            }
        }
        if (diasRiesgo >= 3) {
            alertas.push({
                estacion: nombre, cultivo,
                tipo: 'ROYA', nivel: 'ADVERTENCIA', icono: '🍂',
                mensaje: `${diasRiesgo} días con condiciones favorables`,
                recomendacion: 'Monitoreo fitopatológico',
                clase: 'warning'
            });
        }
    }
    
    const etapa = determinarEtapa(gddActual, cultivo);
    if (etapa.nombre === 'Floración') {
        alertas.push({
            estacion: nombre, cultivo,
            tipo: 'FLORACIÓN', nivel: 'INFORMATIVO', icono: '🌸',
            mensaje: 'El cultivo está en etapa de floración',
            recomendacion: 'Asegurar agua y nutrientes',
            clase: 'info'
        });
    }
    if (etapa.nombre === 'Maduración' || etapa.nombre === 'Maduración de Frutos') {
        alertas.push({
            estacion: nombre, cultivo,
            tipo: 'MADURACIÓN', nivel: 'INFORMATIVO', icono: etapa.icono,
            mensaje: 'Los frutos están iniciando la maduración',
            recomendacion: 'Preparar logística de cosecha',
            clase: 'info'
        });
    }
    
    return alertas;
}

// ============================================================================
// OBTENER DATOS DE TODAS LAS ESTACIONES
// ============================================================================
async function obtenerDatosTodasEstaciones(dias = 10) {
    const resultados = {};
    const estacionesEntrada = Object.entries(ESTACIONES).filter(([_, estacion]) => !estacion.isVirtual);

    const promesas = estacionesEntrada.map(async ([nombre, estacion]) => {
        console.log(`📡 Obteniendo datos de ${nombre} (${dias} días)...`);

        const datos = await fetchStationData(estacion.channel_id, estacion.api_key, dias);
        const prev = state.estaciones?.[nombre];

        if (datos.length > 0) {
            const result = calcularIndicadoresDiarios(datos);
            if (result && result.diario) {
                const diario = result.diario;
                const horarios = result.horarios;
                const gddActual = diario[diario.length - 1]?.gddAcumulado || 0;
                const cultivo = estacion.cultivo || 'cafe';
                const calidad = calcularCalidad(diario, gddActual, cultivo);
                const alertas = generarAlertas(nombre, datos, diario, gddActual, cultivo);

                return {
                    nombre,
                    data: {
                        nombre,
                        datos: horarios,
                        diario,
                        horarios,
                        altura: estacion.altura,
                        gddActual,
                        calidad,
                        alertas,
                        color: estacion.color,
                        colorLight: estacion.colorLight,
                        colorDark: estacion.colorDark,
                        colorGradient: estacion.colorGradient,
                        cultivo,
                        ubicacion: estacion.ubicacion,
                        emoji: estacion.emoji,
                        ultimo: datos[datos.length - 1],
                        ultimoDiario: diario[diario.length - 1],
                        isVirtual: false
                    },
                    horarios
                };
            }
        }

        if (prev) {
            console.warn(`⚠️ Usando datos previos de ${nombre} por falta de respuesta reciente`);
            return {
                nombre,
                data: prev,
                horarios: prev.horarios || []
            };
        }

        return null;
    });

    const entradas = (await Promise.all(promesas)).filter(Boolean);
    entradas.forEach(({ nombre, data, horarios }) => {
        resultados[nombre] = data;
        state.datosHorarios[nombre] = horarios;
    });

    const estacionLonya = Object.entries(ESTACIONES).find(([_, est]) => est.isVirtual);
    if (estacionLonya) {
        const [nombre, estacion] = estacionLonya;
        const dataExtrapolada = construirDatosExtrapoladosLonya(resultados, 1008);
        if (dataExtrapolada.horarios.length > 0) {
            const result = calcularIndicadoresDiarios(dataExtrapolada.horarios);
            if (result && result.diario) {
                const diario = result.diario;
                const horarios = result.horarios;
                const gddActual = diario[diario.length - 1]?.gddAcumulado || 0;
                const cultivo = estacion.cultivo || 'cafe';
                const calidad = calcularCalidad(diario, gddActual, cultivo);
                const alertas = [];

                resultados[nombre] = {
                    nombre,
                    datos: horarios,
                    diario,
                    horarios,
                    altura: estacion.altura,
                    gddActual,
                    calidad,
                    alertas,
                    color: estacion.color,
                    colorLight: estacion.colorLight,
                    colorDark: estacion.colorDark,
                    colorGradient: estacion.colorGradient,
                    cultivo,
                    ubicacion: estacion.ubicacion,
                    emoji: estacion.emoji,
                    ultimo: horarios[horarios.length - 1],
                    ultimoDiario: diario[diario.length - 1],
                    isVirtual: true,
                    correlacionAltitud: dataExtrapolada.correlation
                };

                state.datosHorarios[nombre] = horarios;
            }
        }
    }
    
    return resultados;
}

// ============================================================================
// RENDERIZAR ESTACIONES (Mini Dashboard)
// ============================================================================
function renderGraficasIndividuales(data) {
    const container = DOM.estacionesGrid;
    if (!container) return;
    container.innerHTML = '';
    
    Object.keys(data).forEach(nombre => {
        const est = data[nombre];
        const chartId = `chart_${nombre.replace(/\s/g, '_')}`;
        const cultivoConfig = CULTIVOS[est.cultivo] || CULTIVOS.cafe;
        const dias = est.diario.slice(-CONFIG.DIAS_ANALISIS);
        const etapa = determinarEtapa(est.gddActual, est.cultivo);
        
        const card = document.createElement('div');
        card.className = 'estacion-card';
        card.style.borderTopColor = est.color;
        card.style.borderTopWidth = '4px';
        card.innerHTML = `
            <div class="estacion-header">
                <div class="estacion-nombre">
                    <span class="color-dot" style="background: ${est.color}; width: 14px; height: 14px; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px ${est.color}66;"></span>
                    <span style="color: ${est.color}; font-weight: 700;">${nombre}</span>
                    <span style="font-size: 11px; color: var(--text-muted); font-weight: 400;">
                        ${est.emoji} ${cultivoConfig.nombre}
                    </span>
                </div>
                <span class="estacion-status ${est.alertas.length > 0 ? 'warning' : ''}" style="border-color: ${est.color}; color: ${est.color};">
                    ${est.alertas.length > 0 ? `⚠️ ${est.alertas.length}` : '✅ Normal'}
                </span>
            </div>
            <div class="estacion-datos">
                <div class="dato-item" style="border-left: 3px solid ${est.color};">
                    <div class="dato-valor" style="color: ${est.color};">${formatNumber(est.ultimo?.temperatura || 0)}°C</div>
                    <div class="dato-label">Temp</div>
                </div>
                <div class="dato-item" style="border-left: 3px solid ${est.color};">
                    <div class="dato-valor" style="color: ${est.color};">${formatNumber(est.ultimo?.humedad || 0)}%</div>
                    <div class="dato-label">Humedad</div>
                </div>
                <div class="dato-item" style="border-left: 3px solid ${est.color};">
                    <div class="dato-valor" style="color: ${est.color};">${formatNumber(est.gddActual, 0)}</div>
                    <div class="dato-label">GDD</div>
                </div>
                <div class="dato-item" style="border-left: 3px solid ${est.color};">
                    <div class="dato-valor" style="color: ${(est.ultimoDiario?.balanceAcumulado || 0) >= 0 ? 'var(--secondary-light)' : 'var(--danger)'}">
                        ${formatNumber(est.ultimoDiario?.balanceAcumulado || 0)} mm
                    </div>
                    <div class="dato-label">Balance</div>
                </div>
            </div>
            <div style="display: flex; gap: 12px; margin-bottom: 8px; font-size: 12px; flex-wrap: wrap;">
                <span style="color: var(--text-secondary);">
                    ${etapa.icono} ${etapa.nombre} - ${formatNumber((est.gddActual / cultivoConfig.gddTotal) * 100)}%
                </span>
                <span style="color: var(--text-muted);">
                    📊 ${est.horarios.length} registros
                </span>
                <span style="color: ${est.color}; font-weight: 600;">
                    ● ${est.cultivo.toUpperCase()}
                </span>
            </div>
            <div class="chart-individual">
                <canvas id="${chartId}"></canvas>
            </div>
            <div style="margin-top: 6px; font-size: 10px; color: var(--text-muted); text-align: center;">
                Datos cada 10 min · ${dias.length} días
            </div>
        `;
        container.appendChild(card);
        
        setTimeout(() => {
            const canvas = document.getElementById(chartId);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const horarios = est.horarios;
                const labels = horarios.map(d => formatTime(d.timestamp));
                const tempData = horarios.map(d => d.temperatura);
                const humData = horarios.map(d => d.humedad);
                
                if (state.chartInstances[chartId]) {
                    state.chartInstances[chartId].destroy();
                }
                
                state.chartInstances[chartId] = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Temperatura (°C)',
                                data: tempData,
                                borderColor: '#f78000',
                                backgroundColor: 'rgba(52, 152, 219, 0)',
                                fill: true,
                                tension: 0.1,
                                pointRadius: 0.2,
                                pointHoverRadius: 1,
                                yAxisID: 'y',
                                borderWidth: 1
                            },
                            {
                                label: 'Humedad (%)',
                                data: humData,
                                borderColor: '#3498DB',
                                backgroundColor: 'rgba(52, 152, 219, 0)',
                                fill: true,
                                tension: 0.1,
                                pointRadius: 0.2,
                                pointHoverRadius: 1,
                                borderDash: [4, 4],
                                yAxisID: 'y1',
                                borderWidth: 1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: { 
                                    color: '#000000', 
                                    font: { size: 9 }, 
                                    boxWidth: 12,
                                    padding: 8
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return `${context.dataset.label}: ${formatNumber(context.parsed.y)}`;
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                grid: { color: 'rgba(42,58,78,0.08)' },
                                ticks: { color: '#000000', font: { size: 7 }, maxTicksLimit: 20 }
                            },
                            y: {
                                position: 'left',
                                grid: { color: 'rgba(42,58,78,0.08)' },
                                ticks: { color: '#000000', font: { size: 8 } },
                                min: 5,
                                max: 40,
                                title: {
                                    display: true,
                                    text: '°C',
                                    color: '#78909c',
                                    font: { size: 8 }
                                }
                            },
                            y1: {
                                position: 'right',
                                grid: { display: false },
                                ticks: { color: '#78909c', font: { size: 8 } },
                                min: 30,
                                max: 100,
                                title: {
                                    display: true,
                                    text: '%',
                                    color: '#78909c',
                                    font: { size: 8 }
                                }
                            }
                        }
                    }
                });
            }
        }, 150);
    });
}

// ============================================================================
// RENDERIZAR GRÁFICA PRINCIPAL
// ============================================================================
function renderMainChart(data) {
    const ctx = DOM.mainChart;
    if (!ctx) return;
    if (state.chartInstances.main) {
        state.chartInstances.main.destroy();
    }
    
    const datasets = [];
    const tipoActual = document.querySelector('.btn-chart.active')?.dataset?.type || 'temp';
    
    let allTimestamps = [];
    Object.keys(data)
        .filter(nombre => !data[nombre].isVirtual)
        .forEach(nombre => {
        const est = data[nombre];
        if (est.horarios) {
            const timestamps = est.horarios.map(d => d.timestamp.getTime());
            allTimestamps = allTimestamps.concat(timestamps);
        }
    });
    
    allTimestamps.sort((a, b) => a - b);
    const uniqueTimestamps = [...new Set(allTimestamps)];
    
    Object.keys(data)
        .filter(nombre => !data[nombre].isVirtual)
        .forEach(nombre => {
        const est = data[nombre];
        const horarios = est.horarios || [];
        const dataMap = {};
        horarios.forEach(d => {
            const key = d.timestamp.getTime();
            if (tipoActual === 'temp') {
                dataMap[key] = d.temperatura;
            } else if (tipoActual === 'humedad') {
                dataMap[key] = d.humedad;
            } else {
                const diarioKey = d.timestamp.toDateString();
                const diarioMatch = est.diario.find(di => di.fecha.toDateString() === diarioKey);
                dataMap[key] = diarioMatch ? diarioMatch.gddAcumulado : 0;
            }
        });
        const alignedData = uniqueTimestamps.map(ts => dataMap[ts] !== undefined ? dataMap[ts] : null);
        const chartColors = getDashboardColors(est);
        datasets.push({
            label: `${nombre}`,
            data: alignedData,
            borderColor: chartColors.color,
            backgroundColor: chartColors.colorLight,
            fill: false,
            tension: 0.1,
            pointRadius: 0,
            pointHoverRadius: 6,
            borderWidth: 1.5,
            spanGaps: true,
            pointBackgroundColor: chartColors.color,
            pointBorderColor: '#0f1724',
            pointBorderWidth: 1
        });
    });
    
    const labels = uniqueTimestamps.map(ts => {
        const date = new Date(ts);
        return formatShortDate(date) + ' ' + formatTime(date);
    });
    
    state.chartInstances.main = new Chart(ctx, {
        type: 'line',
        data: { labels: labels, datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    labels: {
                        color: '#010101',
                        font: { size: 10 },
                        padding: 14,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            if (value === null || value === undefined) return `${label}: Sin datos`;
                            const unidad = tipoActual === 'temp' ? '°C' : tipoActual === 'humedad' ? '%' : ' GDD';
                            return `${label}: ${formatNumber(value)}${unidad}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(42,58,78,0.08)' },
                    ticks: { color: '#040404', font: { size: 8 }, maxTicksLimit: 30 }
                },
                y: {
                    grid: { color: 'rgba(42,58,78,0.08)' },
                    ticks: { color: '#000000', font: { size: 9 } },
                    title: {
                        display: true,
                        text: tipoActual === 'temp' ? 'Temperatura (°C)' :
                              tipoActual === 'humedad' ? 'Humedad (%)' : 'GDD Acumulado',
                        color: '#000000',
                        font: { size: 11, weight: '600' }
                    }
                }
            }
        }
    });
}

// ============================================================================
// RENDERIZAR SCATTER CHART
// ============================================================================
function renderScatterChart(data) {
    const ctx = DOM.scatterChart;
    if (!ctx) return;
    if (state.chartInstances.scatter) {
        state.chartInstances.scatter.destroy();
    }
    
    const datasets = [];
    Object.keys(data)
        .filter(nombre => !data[nombre].isVirtual)
        .forEach(nombre => {
        const est = data[nombre];
        const horarios = est.horarios || [];
        const puntos = horarios.map(d => ({ x: d.temperatura, y: d.humedad }));
        if (puntos.length > 0) {
            const chartColors = getDashboardColors(est);
            datasets.push({
                label: nombre,
                data: puntos,
                backgroundColor: chartColors.color,
                borderColor: chartColors.color,
                pointRadius: 1.5,
                pointHoverRadius: 1,
                pointBorderColor: '#0f1724',
                pointBorderWidth: 0
            });
        }
    });
    
    state.chartInstances.scatter = new Chart(ctx, {
        type: 'scatter',
        data: { datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#000000',
                        font: { size: 10 },
                        padding: 12,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatNumber(context.parsed.x)}°C, ${formatNumber(context.parsed.y)}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 5,
                    max: 40,
                    grid: { color: 'rgba(42,58,78,0.08)' },
                    ticks: { color: '#000000', font: { size: 9 } },
                    title: {
                        display: true,
                        text: 'Temperatura (°C)',
                        color: '#2a2d2f',
                        font: { size: 11, weight: '600' }
                    }
                },
                y: {
                    min: 25,
                    max: 100,
                    grid: { color: 'rgba(42,58,78,0.08)' },
                    ticks: { color: '#000000', font: { size: 9 } },
                    title: {
                        display: true,
                        text: 'Humedad Relativa (%)',
                        color: '#2a2d2f',
                        font: { size: 11, weight: '600' }
                    }
                }
            }
        }
    });
}

function buildAltitudeCorrelationData(data) {
    return Object.keys(data)
        .filter(nombre => !data[nombre].isVirtual)
        .map(nombre => {
        const est = data[nombre];
        const temperaturas = Array.isArray(est.horarios) ? est.horarios.map(d => d.temperatura).filter(t => t !== null && t !== undefined) : [];
        const humedades = Array.isArray(est.horarios) ? est.horarios.map(d => d.humedad).filter(h => h !== null && h !== undefined) : [];
        return {
            nombre,
            altura: est.altura || 0,
            promedioTemperatura: average(temperaturas) || (est.ultimo?.temperatura || 0),
            promedioHumedad: average(humedades) || (est.ultimo?.humedad || 0),
            color: est.color
        };
    });
}

function computeLinearRegression(points) {
    const n = points.length;
    if (n === 0) return { slope: 0, intercept: 0, r2: 0 };

    const sumX = points.reduce((acc, p) => acc + p.x, 0);
    const sumY = points.reduce((acc, p) => acc + p.y, 0);
    const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
    const sumXX = points.reduce((acc, p) => acc + p.x * p.x, 0);

    const meanX = sumX / n;
    const meanY = sumY / n;
    const denominator = sumXX - (sumX * sumX) / n;
    const slope = denominator === 0 ? 0 : (sumXY - (sumX * sumY) / n) / denominator;
    const intercept = meanY - slope * meanX;

    const ssTot = points.reduce((acc, p) => acc + Math.pow(p.y - meanY, 2), 0);
    const ssRes = points.reduce((acc, p) => {
        const predictedY = slope * p.x + intercept;
        return acc + Math.pow(p.y - predictedY, 2);
    }, 0);

    const r2 = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot);
    return { slope, intercept, r2 };
}

function renderAltitudeCorrelationChart(ctx, puntos, yTitle, tooltipSuffix) {
    if (!ctx || !Array.isArray(puntos) || puntos.length === 0) return null;
    const validPoints = puntos.filter(p => typeof p.x === 'number' && typeof p.y === 'number');
    if (validPoints.length === 0) return null;
    const minX = Math.min(...validPoints.map(p => p.x));
    const maxX = Math.max(...validPoints.map(p => p.x));
    const minY = Math.min(...validPoints.map(p => p.y));
    const maxY = Math.max(...validPoints.map(p => p.y));

    const regression = computeLinearRegression(validPoints);
    const lineData = [
        { x: minX, y: regression.slope * minX + regression.intercept },
        { x: maxX, y: regression.slope * maxX + regression.intercept }
    ];

    const equation = `y = ${formatNumber(regression.slope, 3)}x ${regression.intercept >= 0 ? '+' : '-'} ${formatNumber(Math.abs(regression.intercept), 3)}`;

    const datasets = validPoints.map(p => ({
        label: p.label,
        data: [{ x: p.x, y: p.y }],
        backgroundColor: p.color,
        borderColor: p.color,
        pointRadius: 7,
        pointHoverRadius: 10,
        borderWidth: 1
    }));

    datasets.push({
        label: `Tendencia (${equation})`,
        data: lineData,
        type: 'line',
        showLine: true,
        borderColor: '#ff0000',
        backgroundColor: 'rgba(255, 213, 79, 0.1)',
        borderWidth: 1.5,
        borderDash: [3, 3],
        pointRadius: 0,
        fill: false,
        tension: 0,
        order: 1
    });

    return new Chart(ctx, {
        type: 'scatter',
        data: { datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                },
                subtitle: {
                    display: true,
                    text: `Ecuación: ${equation} · R²: ${formatNumber(regression.r2, 3)}`,
                    color: '#0f1010',
                    font: { size: 11 }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#b0bec5',
                        font: { size: 10 },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const point = context.raw;
                            return `${context.dataset.label}: Altitud ${formatNumber(point.x, 0)} m · ${formatNumber(point.y)} ${tooltipSuffix}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: Math.max(0, minX - 100),
                    max: maxX + 100,
                    grid: { color: 'rgba(11, 12, 12, 0.08)' },
                    ticks: { color: '#151515', font: { size: 10 } },
                    title: {
                        display: true,
                        text: 'Altitud de la estación (m)',
                        color: '#151515',
                        font: { size: 11, weight: '600' }
                    }
                },
                y: {
                    min: Math.max(0, minY - 5),
                    max: maxY + 5,
                    grid: { color: 'rgba(42,58,78,0.08)' },
                    ticks: { color: '#151515', font: { size: 10 } },
                    title: {
                        display: true,
                        text: yTitle,
                        color: '#151515',
                        font: { size: 11, weight: '600' }
                    }
                }
            }
        }
    });
}

function renderAltitudCorrelationCharts(data) {
    const puntos = buildAltitudeCorrelationData(data);
    if (state.chartInstances.altitudTemp) state.chartInstances.altitudTemp.destroy();
    if (state.chartInstances.altitudHum) state.chartInstances.altitudHum.destroy();

    state.chartInstances.altitudTemp = renderAltitudeCorrelationChart(
        DOM.altitudTempChart,
        puntos.map(p => ({ x: p.altura, y: p.promedioTemperatura, label: p.nombre, color: p.color })),
        'Temperatura promedio (°C)',
        '°C'
    );

    state.chartInstances.altitudHum = renderAltitudeCorrelationChart(
        DOM.altitudHumChart,
        puntos.map(p => ({ x: p.altura, y: p.promedioHumedad, label: p.nombre, color: p.color })),
        'Humedad promedio (%)',
        '%'
    );
}

// ============================================================================
// RENDERIZAR GRÁFICA DE EXTRAPOLACIÓN PARA LONYA
// ============================================================================
function renderGraficaLonya(data) {
    const ctx = DOM.lonyaChart;
    if (!ctx) return;

    const estLonya = data['Parcela LONYA'];
    if (!estLonya || estLonya.isVirtual || !estLonya.horarios || estLonya.horarios.length === 0) {
        if (document.getElementById('lonyaChartCard')) {
            document.getElementById('lonyaChartCard').style.display = 'none';
        }
        return;
    }

    const lonyaCard = document.getElementById('lonyaChartCard');
    if (lonyaCard) lonyaCard.style.display = 'block';

    const horarios = estLonya.horarios.slice(-1008);
    const labels = horarios.map((_, index) => `#${index + 1}`);

    if (state.chartInstances.lonya) {
        state.chartInstances.lonya.destroy();
    }

    state.chartInstances.lonya = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Temperatura extrapolada (°C)',
                    data: horarios.map(d => d.temperatura),
                    borderColor: '#FF8C00',
                    backgroundColor: 'rgba(255, 140, 0, 0.15)',
                    fill: true,
                    tension: 0.2,
                    pointRadius: 0,
                    borderWidth: 2
                },
                {
                    label: 'Humedad extrapolada (%)',
                    data: horarios.map(d => d.humedad),
                    borderColor: '#3498DB',
                    backgroundColor: 'rgba(52, 152, 219, 0.10)',
                    fill: true,
                    tension: 0.2,
                    pointRadius: 0,
                    borderWidth: 2,
                    borderDash: [4, 4]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#b0bec5', font: { size: 10 }, usePointStyle: true } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const unidad = context.dataset.label.includes('Temperatura') ? '°C' : '%';
                            return `${context.dataset.label}: ${formatNumber(context.parsed.y)} ${unidad}`;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Extrapolación por correlación con la altitud (últimos 1008 datos)',
                    color: '#ffffff',
                    font: { size: 12, weight: '600' }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(42,58,78,0.08)' },
                    ticks: { color: '#78909c', font: { size: 8 }, maxTicksLimit: 12 }
                },
                y: {
                    grid: { color: 'rgba(42,58,78,0.08)' },
                    ticks: { color: '#78909c', font: { size: 9 } },
                    title: { display: true, text: 'Valor estimado', color: '#78909c', font: { size: 10 } }
                }
            }
        }
    });
}

// ============================================================================
// RENDERIZAR FENOLOGÍA
// ============================================================================
function renderFenologia(data) {
    const container = DOM.fenologicoGrid;
    if (!container) return;
    container.innerHTML = '';
    
    Object.keys(data)
        .filter(nombre => !data[nombre].isVirtual)
        .forEach(nombre => {
        const est = data[nombre];
        const cultivoConfig = CULTIVOS[est.cultivo] || CULTIVOS.cafe;
        const etapa = determinarEtapa(est.gddActual, est.cultivo);
        const pct = (est.gddActual / cultivoConfig.gddTotal) * 100;
        
        const card = document.createElement('div');
        card.className = 'fenologico-card';
        card.style.borderLeft = `4px solid ${est.color}`;
        card.innerHTML = `
            <h4>
                <span style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: ${est.color}; box-shadow: 0 0 10px ${est.color}66;"></span>
                <span style="color: ${est.color};">${nombre}</span>
                <span style="font-size: 12px; color: var(--text-muted); font-weight: 400;">
                    ${est.emoji} ${cultivoConfig.nombre}
                </span>
            </h4>
            <div class="etapa-display">
                <span class="etapa-icon">${etapa.icono}</span>
                <span class="etapa-nombre" style="color: ${est.color};">${etapa.nombre}</span>
            </div>
            <div class="progress-container">
                <div class="progress-label">
                    <span>Progreso a Madurez</span>
                    <span style="color: ${est.color};">${formatNumber(pct)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(100, pct)}%; background: ${est.colorGradient};"></div>
                </div>
            </div>
            <div class="etapa-detalles">
                <div class="detalle-item">
                    <span class="detalle-label">GDD Actual</span>
                    <span class="detalle-value" style="color: ${est.color};">${formatNumber(est.gddActual, 0)}</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-label">GDD Requerido</span>
                    <span class="detalle-value">${cultivoConfig.gddTotal}</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-label">Balance Hídrico</span>
                    <span class="detalle-value" style="color: ${(est.ultimoDiario?.balanceAcumulado || 0) >= 0 ? 'var(--secondary-light)' : 'var(--danger)'}">
                        ${formatNumber(est.ultimoDiario?.balanceAcumulado || 0)} mm
                    </span>
                </div>
            </div>
            <div style="margin-top: 10px; font-size: 11px; color: var(--text-muted);">
                📊 ${est.horarios.length} registros horarios · Último: ${formatDate(est.ultimo?.timestamp)}
            </div>
        `;
        container.appendChild(card);
    });
}

// ============================================================================
// RENDERIZAR CALIDAD
// ============================================================================
function renderCalidad(data) {
    const container = DOM.calidadGrid;
    if (!container) return;
    container.innerHTML = '';
    
    Object.keys(data)
        .filter(nombre => !data[nombre].isVirtual)
        .forEach(nombre => {
        const est = data[nombre];
        const cal = est.calidad;
        if (!cal) return;
        
        const card = document.createElement('div');
        card.className = 'calidad-card';
        card.style.borderTop = `4px solid ${est.color}`;
        card.innerHTML = `
            <h4>
                <span style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: ${est.color}; box-shadow: 0 0 10px ${est.color}66;"></span>
                <span style="color: ${est.color};">${nombre}</span>
                <span style="font-size: 12px; color: var(--text-muted); font-weight: 400;">
                    ${est.emoji} ${CULTIVOS[est.cultivo]?.nombre}
                </span>
            </h4>
            <div class="calidad-pq">
                <span class="pq-number" style="color: ${est.color};">${formatNumber(cal.pq, 0)}</span>
                <div>
                    <span class="categoria-badge ${cal.clase}" style="border: 2px solid ${est.color};">${cal.categoria}</span>
                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                        Basado en ${est.horarios.length} registros
                    </div>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
                <div style="background: var(--bg-hover); padding: 8px; border-radius: 6px; text-align: center; border-left: 3px solid ${est.color};">
                    <span style="font-size: 10px; color: var(--text-muted);">Térmico</span>
                    <div style="font-size: 16px; font-weight: 600; color: ${est.color};">${formatNumber(cal.factores.termico, 2)}</div>
                </div>
                <div style="background: var(--bg-hover); padding: 8px; border-radius: 6px; text-align: center; border-left: 3px solid ${est.color};">
                    <span style="font-size: 10px; color: var(--text-muted);">Hídrico</span>
                    <div style="font-size: 16px; font-weight: 600; color: ${est.color};">${formatNumber(cal.factores.hidrico, 2)}</div>
                </div>
                <div style="background: var(--bg-hover); padding: 8px; border-radius: 6px; text-align: center; border-left: 3px solid ${est.color};">
                    <span style="font-size: 10px; color: var(--text-muted);">Madurez</span>
                    <div style="font-size: 16px; font-weight: 600; color: ${est.color};">${formatNumber(cal.factores.madurez, 2)}</div>
                </div>
            </div>
            <div class="perfil-grid">
                <div class="perfil-item" style="border: 1px solid ${est.color}30;">
                    <i class="fas fa-flask" style="color: ${est.color}"></i>
                    <span class="perfil-label">Acidez</span>
                    <span class="perfil-value" style="color: ${est.color};">${cal.perfil.acidez}</span>
                </div>
                <div class="perfil-item" style="border: 1px solid ${est.color}30;">
                    <i class="fas fa-hand-fist" style="color: ${est.color}"></i>
                    <span class="perfil-label">Cuerpo</span>
                    <span class="perfil-value" style="color: ${est.color};">${cal.perfil.cuerpo}</span>
                </div>
                <div class="perfil-item" style="border: 1px solid ${est.color}30;">
                    <i class="fas fa-wind" style="color: ${est.color}"></i>
                    <span class="perfil-label">Aroma</span>
                    <span class="perfil-value" style="color: ${est.color};">${cal.perfil.aroma}</span>
                </div>
                <div class="perfil-item" style="border: 1px solid ${est.color}30;">
                    <i class="fas fa-candy-cane" style="color: ${est.color}"></i>
                    <span class="perfil-label">Dulzor</span>
                    <span class="perfil-value" style="color: ${est.color};">${cal.perfil.dulzor}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// ============================================================================
// RENDERIZAR ALERTAS
// ============================================================================
function renderAlertas(alertas) {
    const container = DOM.alertasContainer;
    if (!container) return;
    
    if (alertas.length === 0) {
        container.innerHTML = `
            <div class="alertas-empty">
                <i class="fas fa-check-circle"></i>
                <p>No hay alertas activas</p>
                <span>Todos los cultivos se encuentran en condiciones óptimas</span>
            </div>
        `;
        return;
    }
    
    const porEstacion = {};
    alertas.forEach(a => {
        if (!porEstacion[a.estacion]) porEstacion[a.estacion] = [];
        porEstacion[a.estacion].push(a);
    });
    
    container.innerHTML = '';
    Object.keys(porEstacion).forEach(nombre => {
        const est = state.estaciones[nombre];
        const color = est?.color || 'var(--secondary)';
        const cultivoIcon = est?.emoji || '';
        
        const grupo = document.createElement('div');
        grupo.style.cssText = 'margin-bottom: 12px;';
        grupo.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: ${color}; box-shadow: 0 0 8px ${color}66;"></span>
                <strong style="color: ${color};">${nombre}</strong>
                <span style="font-size: 12px; color: var(--text-muted);">${cultivoIcon} ${porEstacion[nombre].length} alerta(s)</span>
            </div>
            ${porEstacion[nombre].map(a => `
                <div class="alerta-item ${a.clase}" style="border-left-color: ${color};">
                    <div class="alerta-icon">${a.icono}</div>
                    <div class="alerta-content">
                        <div class="alerta-titulo">
                            <strong>${a.tipo}</strong>
                            <span class="alerta-nivel ${a.clase}">${a.nivel}</span>
                        </div>
                        <div class="alerta-mensaje">${a.mensaje}</div>
                        <div class="alerta-recomendacion">
                            <i class="fas fa-lightbulb"></i> ${a.recomendacion}
                        </div>
                    </div>
                </div>
            `).join('')}
        `;
        container.appendChild(grupo);
    });
}

// ============================================================================
// RENDERIZAR KPI
// ============================================================================
function renderKPI(data) {
    const nombres = Object.keys(data).filter(nombre => !data[nombre].isVirtual);
    if (nombres.length === 0) return;
    
    let gddTotal = 0, calidadTotal = 0, balanceTotal = 0;
    let alertasTotales = 0;
    const todasAlertas = [];
    let cafeCalidad = 0, cafeGDD = 0, cacaoCalidad = 0, cacaoGDD = 0;
    let cafeCount = 0, cacaoCount = 0;
    
    nombres.forEach(nombre => {
        const est = data[nombre];
        gddTotal += est.gddActual;
        calidadTotal += est.calidad?.pq || 0;
        balanceTotal += est.ultimoDiario?.balanceAcumulado || 0;
        alertasTotales += est.alertas.length;
        todasAlertas.push(...est.alertas);
        
        if (est.cultivo === 'cafe') {
            cafeCalidad += est.calidad?.pq || 0;
            cafeGDD += est.gddActual;
            cafeCount++;
        } else if (est.cultivo === 'cacao') {
            cacaoCalidad += est.calidad?.pq || 0;
            cacaoGDD += est.gddActual;
            cacaoCount++;
        }
    });
    
    const count = nombres.length;

    if (DOM.kpiGDD) DOM.kpiGDD.textContent = formatNumber(gddTotal / count, 0);
    if (DOM.kpiGDDSub) DOM.kpiGDDSub.textContent = `${formatNumber((gddTotal / count / CONFIG.UMBRALES.gddTotal) * 100)}% madurez`;
    
    if (DOM.kpiCalidad) DOM.kpiCalidad.textContent = formatNumber(calidadTotal / count, 0);
    if (DOM.kpiCalidadSub) DOM.kpiCalidadSub.textContent = `${count} estaciones`;
    
    if (DOM.kpiBalance) DOM.kpiBalance.textContent = `${formatNumber(balanceTotal / count)} mm`;
    if (DOM.kpiBalanceSub) DOM.kpiBalanceSub.textContent = (balanceTotal / count) >= 0 ? 'Superávit promedio' : 'Déficit promedio';
    if (DOM.kpiBalance) DOM.kpiBalance.style.color = (balanceTotal / count) >= 0 ? 'var(--secondary-light)' : 'var(--danger)';
    
    if (DOM.kpiAlertas) DOM.kpiAlertas.textContent = alertasTotales;
    if (DOM.kpiAlertasSub) DOM.kpiAlertasSub.textContent = alertasTotales > 0 ? `${alertasTotales} alerta(s) activa(s)` : 'Sin alertas';
    if (DOM.alertaBadge) {
        DOM.alertaBadge.textContent = alertasTotales;
        DOM.alertaBadge.style.display = alertasTotales > 0 ? 'inline' : 'none';
    }
    
    if (DOM.cafeCalidad) DOM.cafeCalidad.textContent = cafeCount > 0 ? formatNumber(cafeCalidad / cafeCount, 0) : '--';
    if (DOM.cafeGDD) DOM.cafeGDD.textContent = cafeCount > 0 ? formatNumber(cafeGDD / cafeCount, 0) : '--';
    if (DOM.cacaoCalidad) DOM.cacaoCalidad.textContent = cacaoCount > 0 ? formatNumber(cacaoCalidad / cacaoCount, 0) : '--';
    if (DOM.cacaoGDD) DOM.cacaoGDD.textContent = cacaoCount > 0 ? formatNumber(cacaoGDD / cacaoCount, 0) : '--';
    
    state.estaciones = data;
    state.alertas = todasAlertas;
}

// ============================================================================
// MAPA DE ESTACIONES - CONVERSIÓN UTM CORRECTA (ZONA 17S)
// ============================================================================

function utmToLatLng(este, norte, zona = 17, hemisferio = 'S') {
    const a = 6378137;
    const f = 1 / 298.257223563;
    const k0 = 0.9996;
    const e = Math.sqrt(2 * f - f * f);
    const e1 = (1 - Math.sqrt(1 - e * e)) / (1 + Math.sqrt(1 - e * e));
    const norteAjustado = hemisferio === 'S' ? norte - 10000000 : norte;
    const lon0 = (zona * 6 - 183) * Math.PI / 180;
    const x = este - 500000;
    const y = norteAjustado;
    const M = y / k0;
    const mu = M / (a * (1 - e * e / 4 - 3 * e * e * e * e / 64 - 5 * e * e * e * e * e * e / 256));
    const phi1 = mu + (3 * e1 / 2 - 27 * e1 * e1 * e1 / 32) * Math.sin(2 * mu) +
        (21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 * e1 / 32) * Math.sin(4 * mu) +
        (151 * e1 * e1 * e1 / 96) * Math.sin(6 * mu);
    const N1 = a / Math.sqrt(1 - e * e * Math.sin(phi1) * Math.sin(phi1));
    const T1 = Math.tan(phi1) * Math.tan(phi1);
    const C1 = e * e * Math.cos(phi1) * Math.cos(phi1) / (1 - e * e);
    const R1 = a * (1 - e * e) / Math.pow(1 - e * e * Math.sin(phi1) * Math.sin(phi1), 1.5);
    const D = x / (N1 * k0);
    const lat = phi1 - (N1 * Math.tan(phi1) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * e * e) * D * D * D * D / 24 + 
        (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * e * e - 3 * C1 * C1) * D * D * D * D * D * D / 720);
    const lng = (D - (1 + 2 * T1 + C1) * D * D * D / 6 + 
        (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * e * e + 24 * T1 * T1) * D * D * D * D * D / 120) / Math.cos(phi1);
    return {
        lat: lat * 180 / Math.PI,
        lng: (lng * 180 / Math.PI + lon0 * 180 / Math.PI)
    };
}

// ============================================================================
// COORDENADAS DE LAS ESTACIONES (ZONA 17S)
// ============================================================================

function calcularCoordenadas() {
    const resultados = {};
    Object.keys(ESTACIONES).forEach(nombre => {
        const est = ESTACIONES[nombre];
        if (est.isVirtual) return;
        if (est.este && est.norte) {
            const latLng = utmToLatLng(est.este, est.norte, 17, 'S');
            resultados[nombre] = {
                lat: latLng.lat,
                lng: latLng.lng,
                este: est.este,
                norte: est.norte,
                altura: est.altura,
                lugar: est.lugar
            };
            console.log(`📍 ${nombre}: ${latLng.lat.toFixed(6)}, ${latLng.lng.toFixed(6)}`);
        }
    });
    return resultados;
}

// ============================================================================
// INICIALIZAR MAPA DE ESTACIONES
// ============================================================================

let mapaEstaciones = null;
let marcadoresEstaciones = [];
let mapaInicializado = false;

function inicializarMapaEstaciones() {
    const container = document.getElementById('estacionesMapa');
    if (!container) {
        console.warn('⚠️ Contenedor del mapa no encontrado');
        return;
    }
    
    if (typeof L === 'undefined') {
        setTimeout(inicializarMapaEstaciones, 500);
        return;
    }
    
    if (mapaEstaciones) {
        mapaEstaciones.remove();
        mapaEstaciones = null;
    }
    
    const coordenadas = calcularCoordenadas();
    let latSum = 0, lngSum = 0, count = 0;
    Object.keys(coordenadas).forEach(nombre => {
        const coord = coordenadas[nombre];
        if (coord.lat && coord.lng) {
            latSum += coord.lat;
            lngSum += coord.lng;
            count++;
        }
    });
    
    const centerLat = count > 0 ? latSum / count : -6.0;
    const centerLng = count > 0 ? lngSum / count : -75.2;
    
    mapaEstaciones = L.map(container, {
        zoomControl: true,
        attributionControl: true
    }).setView([centerLat, centerLng], 8);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapaEstaciones);
    
    const sateliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google'
    });
    
    const baseMaps = {
        'Mapa': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }),
        'Satélite': sateliteLayer
    };
    
    L.control.layers(baseMaps).addTo(mapaEstaciones);
    
    marcadoresEstaciones = [];
    Object.keys(coordenadas).forEach(nombre => {
        const coord = coordenadas[nombre];
        const estacion = ESTACIONES[nombre];
        if (estacion?.isVirtual) return;
        if (!coord.lat || !coord.lng) return;
        const color = estacion?.color || '#000000';
        const emoji = estacion?.emoji || '📍';
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="width: 32px; height: 32px; background: ${color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; color: white; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); font-weight: bold;">${emoji}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16]
        });
        const marker = L.marker([coord.lat, coord.lng], { icon })
            .addTo(mapaEstaciones)
            .bindPopup(crearPopupHTML(nombre, coord, estacion));
        marker.bindTooltip(nombre, {
            className: 'mapa-tooltip',
            permanent: false,
            direction: 'top'
        });
        marcadoresEstaciones.push(marker);
    });
    
    if (marcadoresEstaciones.length > 0) {
        const group = L.featureGroup(marcadoresEstaciones);
        mapaEstaciones.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
    
    const totalEl = document.getElementById('mapaTotalEstaciones');
    if (totalEl) totalEl.textContent = Object.keys(coordenadas).length;
    
    mapaInicializado = true;
    
    setTimeout(() => {
        if (mapaEstaciones) {
            mapaEstaciones.invalidateSize();
        }
    }, 500);
}

function crearPopupHTML(nombre, coord, estacion) {
    const cultivo = estacion?.cultivo || 'cafe';
    const cultivoNombre = CULTIVOS[cultivo]?.nombre || cultivo;
    const emoji = estacion?.emoji || '📍';
    const color = estacion?.color || '#2ecc71';
    const ubicacion = estacion?.ubicacion || coord.lugar || 'Sin ubicación';
    const datosEstacion = state.estaciones[nombre];
    const temp = datosEstacion?.ultimo?.temperatura ? formatNumber(datosEstacion.ultimo.temperatura) : '--';
    const hum = datosEstacion?.ultimo?.humedad ? formatNumber(datosEstacion.ultimo.humedad) : '--';
    const gdd = datosEstacion?.gddActual ? formatNumber(datosEstacion.gddActual, 0) : '--';
    const calidad = datosEstacion?.calidad?.pq ? formatNumber(datosEstacion.calidad.pq, 0) : '--';
    return `
        <div class="mapa-popup">
            <div class="popup-header">
                <span class="popup-icon">${emoji}</span>
                <span class="popup-title" style="color: ${color};">${nombre}</span>
                <span class="popup-cultivo ${cultivo}" style="background: ${color}22; color: ${color};">${cultivoNombre}</span>
            </div>
            <div class="popup-body">
                <div class="popup-row"><span class="label">📍 Ubicación</span><span class="value">${ubicacion}</span></div>
                <div class="popup-row"><span class="label">🗺️ Altura</span><span class="value">${coord.altura || '--'} m</span></div>
                <div class="popup-row"><span class="label">📌 UTM</span><span class="value">${coord.este}E / ${coord.norte}N</span></div>
                <div class="popup-row"><span class="label">🌡️ Temperatura</span><span class="value" style="color: ${temp > 25 ? '#e74c3c' : '#2ecc71'};">${temp}°C</span></div>
                <div class="popup-row"><span class="label">💧 Humedad</span><span class="value" style="color: ${hum > 80 ? '#3498db' : '#f39c12'};">${hum}%</span></div>
                <div class="popup-row"><span class="label">📊 GDD</span><span class="value">${gdd}</span></div>
                <div class="popup-row"><span class="label">🏆 Calidad</span><span class="value" style="color: ${calidad > 70 ? '#27ae60' : '#f39c12'};">${calidad} pts</span></div>
            </div>
            <div class="popup-footer"><i class="fas fa-clock"></i> Datos en tiempo real</div>
        </div>
    `;
}

function actualizarMapaEstaciones() {
    if (!mapaInicializado) {
        inicializarMapaEstaciones();
        return;
    }
    if (mapaEstaciones) {
        const coordenadas = calcularCoordenadas();
        marcadoresEstaciones.forEach((marker, index) => {
            const nombres = Object.keys(coordenadas);
            if (index < nombres.length) {
                const nombre = nombres[index];
                const coord = coordenadas[nombre];
                const estacion = ESTACIONES[nombre];
                marker.setPopupContent(crearPopupHTML(nombre, coord, estacion));
            }
        });
    }
}

function setupMapaObserver() {
    const estacionesSection = document.getElementById('estaciones');
    if (!estacionesSection) return;
    const observer = new MutationObserver(() => {
        if (estacionesSection.classList.contains('active')) {
            setTimeout(() => {
                if (mapaEstaciones) {
                    mapaEstaciones.invalidateSize();
                } else {
                    inicializarMapaEstaciones();
                }
            }, 300);
        }
    });
    observer.observe(estacionesSection, { attributes: true, attributeFilter: ['class'] });
}

function inicializarMapaYObserver() {
    setTimeout(() => {
        const estacionesSection = document.getElementById('estaciones');
        if (estacionesSection && estacionesSection.classList.contains('active')) {
            inicializarMapaEstaciones();
        }
    }, 1000);
    setupMapaObserver();
}

// ============================================================================
// FUNCIONES DE REPORTE AVANZADO
// ============================================================================

let reporteChartInstances = {};
let reporteData = null;

function inicializarSelectorReporte() {
    const selector = document.getElementById('reporteEstacionSelector');
    if (!selector) return;
    selector.innerHTML = '<option value="">🌐 Todas las estaciones</option>';
    Object.keys(ESTACIONES)
        .filter(nombre => !ESTACIONES[nombre].isVirtual)
        .forEach(nombre => {
        const est = ESTACIONES[nombre];
        const option = document.createElement('option');
        option.value = nombre;
        option.textContent = `${est.emoji} ${nombre} (${est.cultivo.toUpperCase()})`;
        option.style.color = est.color;
        selector.appendChild(option);
    });
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - 15);
    const inputInicio = document.getElementById('reporteFechaInicio');
    const inputFin = document.getElementById('reporteFechaFin');
    if (inputInicio) inputInicio.value = fechaInicio.toISOString().split('T')[0];
    if (inputFin) inputFin.value = fechaFin.toISOString().split('T')[0];
}

function setTextContent(id, value) {
    const el = document.getElementById(id);
    if (el) { el.textContent = value; return true; }
    return false;
}

function showReporteLoading(message) {
    const resultados = document.getElementById('reporteResultados');
    if (!resultados) return;
    let loading = resultados.querySelector('.reporte-loading');
    if (!loading) {
        loading = document.createElement('div');
        loading.className = 'reporte-loading';
        resultados.insertBefore(loading, resultados.firstChild);
    }
    loading.innerHTML = `<i class="fas fa-spinner fa-spin fa-3x"></i><span>${message}</span>`;
    loading.style.display = 'flex';
    resultados.style.position = 'relative';
}

function hideReporteLoading() {
    const resultados = document.getElementById('reporteResultados');
    if (!resultados) return;
    const loading = resultados.querySelector('.reporte-loading');
    if (loading) loading.style.display = 'none';
}

async function generarReporte() {
    const estacionNombre = document.getElementById('reporteEstacionSelector')?.value || '';
    const fechaInicio = document.getElementById('reporteFechaInicio')?.value || '';
    const fechaFin = document.getElementById('reporteFechaFin')?.value || '';
    if (!fechaInicio || !fechaFin) { alert('Por favor, selecciona un rango de fechas'); return; }
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    if (inicio > fin) { alert('La fecha de inicio no puede ser mayor a la fecha final'); return; }
    const diasDiff = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
    if (diasDiff > 365) { alert('El periodo máximo es de 365 días para análisis de campaña'); return; }
    const resultados = document.getElementById('reporteResultados');
    if (!resultados) { console.error('❌ Elemento reporteResultados no encontrado'); return; }
    resultados.style.display = 'block';
    showReporteLoading(`Generando reporte... Cargando datos de ${diasDiff} días`);
    try {
        let datosCombinados = [];
        let estacionInfo = null;
        let cultivoInfo = null;
        if (estacionNombre) {
            const est = ESTACIONES[estacionNombre];
            if (!est) { throw new Error(`Estación "${estacionNombre}" no encontrada`); }
            estacionInfo = est;
            cultivoInfo = CULTIVOS[est.cultivo];
            const rawData = await fetchStationData(est.channel_id, est.api_key, diasDiff + 5);
            const filtered = rawData.filter(d => d.timestamp >= inicio && d.timestamp <= fin);
            if (filtered.length === 0) { throw new Error('No hay datos en el rango seleccionado'); }
            const processed = calcularIndicadoresDiarios(filtered);
            if (processed) {
                datosCombinados = processed.diario.map(d => ({ ...d, estacion: estacionNombre, cultivo: est.cultivo, color: est.color }));
            }
        } else {
            const nombres = Object.keys(ESTACIONES);
            for (const nombre of nombres) {
                const est = ESTACIONES[nombre];
                const rawData = await fetchStationData(est.channel_id, est.api_key, diasDiff + 5);
                const filtered = rawData.filter(d => d.timestamp >= inicio && d.timestamp <= fin);
                if (filtered.length > 0) {
                    const processed = calcularIndicadoresDiarios(filtered);
                    if (processed) {
                        processed.diario.forEach(d => {
                            datosCombinados.push({ ...d, estacion: nombre, cultivo: est.cultivo, color: est.color });
                        });
                    }
                }
                await sleep(200);
            }
            const primera = Object.keys(ESTACIONES)[0];
            if (primera) {
                estacionInfo = ESTACIONES[primera];
                cultivoInfo = CULTIVOS[estacionInfo.cultivo];
            }
        }
        if (datosCombinados.length === 0) { throw new Error('No se encontraron datos en el rango seleccionado'); }
        datosCombinados.sort((a, b) => a.fecha - b.fecha);
        let gddAcum = 0;
        datosCombinados.forEach(d => { gddAcum += d.gdd; d.gddAcumulado = gddAcum; });
        reporteData = { datos: datosCombinados, estacionInfo, cultivoInfo, fechaInicio: inicio, fechaFin: fin, estacionNombre };
        renderReporte(reporteData);
    } catch (error) {
        console.error('❌ Error al generar reporte:', error);
        if (resultados) {
            showReporteLoading(`Error: ${error.message}`);
            const loading = resultados.querySelector('.reporte-loading');
            if (loading) loading.style.color = 'var(--danger)';
        }
        setTimeout(hideReporteLoading, 5000);
    } finally {
        hideReporteLoading();
    }
}

function renderReporte(data) {
    const { datos, estacionInfo, cultivoInfo, fechaInicio, fechaFin, estacionNombre } = data;
    const resultados = document.getElementById('reporteResultados');
    if (!resultados) { console.error('❌ Elemento reporteResultados no encontrado'); return; }
    if (!datos || datos.length === 0) {
        resultados.innerHTML = `<div class="reporte-loading" style="color: var(--danger);"><i class="fas fa-exclamation-circle fa-3x"></i><span>No hay datos disponibles para el periodo seleccionado</span></div>`;
        return;
    }
    resultados.style.display = 'block';
    const periodoStr = `${formatDateOnly(fechaInicio)} - ${formatDateOnly(fechaFin)}`;
    setTextContent('reportePeriodo', periodoStr);
    setTextContent('reporteUbicacion', estacionNombre || 'Todas las estaciones');
    setTextContent('reporteCultivo', cultivoInfo ? `${cultivoInfo.icono} ${cultivoInfo.nombre}` : 'Múltiples cultivos');
    setTextContent('reporteRegistros', `${datos.length} registros diarios`);
    const temps = datos.map(d => d.tempMean);
    const hums = datos.map(d => d.humedadMean);
    const gddTotal = datos[datos.length - 1]?.gddAcumulado || 0;
    const balances = datos.map(d => d.balanceAcumulado);
    const precipTotal = datos.reduce((sum, d) => sum + d.precipitacion, 0);
    const etoTotal = datos.reduce((sum, d) => sum + d.eto, 0);
    const tempProm = temps.length > 0 ? temps.reduce((a, b) => a + b, 0) / temps.length : 0;
    const tempMax = temps.length > 0 ? Math.max(...temps) : 0;
    const tempMin = temps.length > 0 ? Math.min(...temps) : 0;
    const humProm = hums.length > 0 ? hums.reduce((a, b) => a + b, 0) / hums.length : 0;
    const humMax = hums.length > 0 ? Math.max(...hums) : 0;
    const humMin = hums.length > 0 ? Math.min(...hums) : 0;
    const balanceFinal = balances.length > 0 ? balances[balances.length - 1] : 0;
    const calidad = calcularCalidad(datos, gddTotal, estacionInfo?.cultivo || 'cafe');
    const statTemp = document.getElementById('reporteStatTemp');
    if (statTemp) statTemp.innerHTML = `${formatNumber(tempProm)} <span class="unit">°C</span>`;
    setTextContent('reporteStatTempSub', `Máx: ${formatNumber(tempMax)}°C / Mín: ${formatNumber(tempMin)}°C`);
    const statHum = document.getElementById('reporteStatHum');
    if (statHum) statHum.innerHTML = `${formatNumber(humProm)} <span class="unit">%</span>`;
    setTextContent('reporteStatHumSub', `Máx: ${formatNumber(humMax)}% / Mín: ${formatNumber(humMin)}%`);
    setTextContent('reporteStatGDD', formatNumber(gddTotal, 0));
    const pctGDD = cultivoInfo ? (gddTotal / cultivoInfo.gddTotal) * 100 : 0;
    setTextContent('reporteStatGDDSub', `Progreso: ${formatNumber(pctGDD)}%`);
    const statBalance = document.getElementById('reporteStatBalance');
    if (statBalance) statBalance.innerHTML = `${formatNumber(balanceFinal)} <span class="unit">mm</span>`;
    setTextContent('reporteStatBalanceSub', `Precip: ${formatNumber(precipTotal)}mm / ETo: ${formatNumber(etoTotal)}mm`);
    if (calidad) {
        setTextContent('reporteStatCalidad', formatNumber(calidad.pq, 0));
        const subEl = document.getElementById('reporteStatCalidadSub');
        if (subEl) {
            subEl.textContent = calidad.categoria;
            subEl.style.color = calidad.clase === 'excelente' ? '#27ae60' : calidad.clase === 'bueno' ? '#f39c12' : '#e67e22';
        }
    } else {
        setTextContent('reporteStatCalidad', '--');
        setTextContent('reporteStatCalidadSub', 'No disponible');
    }
    renderReporteTabla(datos);
    renderReporteGraficos(datos, estacionInfo);
    const tableInfo = document.getElementById('reporteTableInfo');
    if (tableInfo) tableInfo.textContent = `${datos.length} registros diarios`;
}

function renderReporteTabla(datos) {
    const tbody = document.getElementById('reporteTableBody');
    if (!tbody) return;
    const mostrar = datos.slice(-15).reverse();
    tbody.innerHTML = mostrar.map(d => `
        <tr>
            <td><strong>${formatDateOnly(d.fecha)}</strong></td>
            <td>${formatNumber(d.tempMean)}</td>
            <td style="color: #e74c3c; font-weight: 600;">${formatNumber(d.tempMax)}</td>
            <td style="color: #2980b9; font-weight: 600;">${formatNumber(d.tempMin)}</td>
            <td>${formatNumber(d.humedadMean)}</td>
            <td style="color: #2980b9; font-weight: 600;">${formatNumber(d.humedadMean)}</td>
            <td style="color: #8e44ad; font-weight: 600;">${formatNumber(d.humedadMean)}</td>
            <td style="color: #27ae60; font-weight: 600;">${formatNumber(d.gddAcumulado, 0)}</td>
            <td>${formatNumber(d.precipitacion)}</td>
            <td style="color: ${d.balanceAcumulado >= 0 ? '#27ae60' : '#e74c3c'}; font-weight: 600;">${formatNumber(d.balanceAcumulado)}</td>
            <td>${formatNumber(d.radiacionMean, 0)}</td>
        </tr>
    `).join('');
}

function renderReporteGraficos(datos, estacionInfo) {
    const color = estacionInfo?.color || '#2ecc71';
    const labels = datos.map(d => formatDateOnly(d.fecha));
    const tempProm = datos.map(d => d.tempMean);
    const tempMax = datos.map(d => d.tempMax);
    const tempMin = datos.map(d => d.tempMin);
    const humProm = datos.map(d => d.humedadMean);
    const gddAcum = datos.map(d => d.gddAcumulado || 0);
    const precip = datos.map(d => d.precipitacion);
    const balance = datos.map(d => d.balanceAcumulado || 0);
    const rad = datos.map(d => d.radiacionMean || 0);
    
    Object.keys(reporteChartInstances).forEach(key => {
        if (reporteChartInstances[key]) reporteChartInstances[key].destroy();
    });
    reporteChartInstances = {};
    
    const mainChart = document.getElementById('reporteMainChart');
    if (mainChart) {
        reporteChartInstances.main = new Chart(mainChart, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Temperatura Promedio (°C)', data: tempProm, borderColor: '#e9af00', backgroundColor: 'rgba(243, 243, 243, 0)', fill: true, tension: 0.3, pointRadius: 1, borderWidth: 2.0, yAxisID: 'y' },
                    { label: 'Humedad Promedio (%)', data: humProm, borderColor: '#00d1d1', backgroundColor: 'rgba(247, 248, 248, 0)', fill: true, tension: 0.3, pointRadius: 1, borderWidth: 2.0, yAxisID: 'y1' },
                    { label: 'GDD Acumulado', data: gddAcum, borderColor: '#3d3b3b', backgroundColor: 'rgba(237, 240, 238, 0)', fill: true, tension: 0.3, pointRadius: 1, borderWidth: 2.0, yAxisID: 'y2' }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
                plugins: { legend: { labels: { color: '#b0bec5', font: { size: 10 }, usePointStyle: true } } },
                scales: {
                    x: { grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#78909c', font: { size: 9 }, maxTicksLimit: 30 } },
                    y: { position: 'left', grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'Temperatura (°C)', color: '#78909c', font: { size: 10 } } },
                    y1: { position: 'right', grid: { display: false }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'Humedad (%)', color: '#78909c', font: { size: 10 } }, min: 20, max: 100 },
                    y2: { position: 'right', grid: { display: false }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'GDD', color: '#78909c', font: { size: 10 } }, display: false }
                }
            }
        });
    }
    
    const tempChart = document.getElementById('reporteTempChart');
    if (tempChart) {
        reporteChartInstances.temp = new Chart(tempChart, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Máxima Diaria', data: tempMax, borderColor: '#e74c3c', backgroundColor: 'rgba(240, 178, 6, 0.1)', fill: true, tension: 0.3, pointRadius: 1, borderWidth: 2 },
                    { label: 'Promedio Diario', data: tempProm, borderColor: color, backgroundColor: 'transparent', fill: false, tension: 0.3, pointRadius: 1, borderWidth: 2.5, borderDash: [3, 3] },
                    { label: 'Mínima Diaria', data: tempMin, borderColor: '#eead4c', backgroundColor: 'rgb(248, 240, 240)', fill: true, tension: 0.3, pointRadius: 1, borderWidth: 2 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#b0bec5', font: { size: 10 }, usePointStyle: true } } },
                scales: {
                    x: { grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#78909c', font: { size: 9 } } },
                    y: { grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'Temperatura (°C)', color: '#78909c', font: { size: 10 } } }
                }
            }
        });
    }
    
    const humChart = document.getElementById('reporteHumChart');
    if (humChart) {
        reporteChartInstances.hum = new Chart(humChart, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Máxima Diaria', data: humProm.map(h => h + 5), borderColor: '#2980b9', backgroundColor: 'rgba(41, 128, 185, 0.05)', fill: true, tension: 0.3, pointRadius: 1, borderWidth: 2 },
                    { label: 'Promedio Diario', data: humProm, borderColor: color, backgroundColor: 'transparent', fill: false, tension: 0.3, pointRadius: 3, borderWidth: 2.5, borderDash: [3, 3] },
                    { label: 'Mínima Diaria', data: humProm.map(h => h - 5), borderColor: '#8e44ad', backgroundColor: 'rgba(142, 68, 173, 0.05)', fill: true, tension: 0.3, pointRadius: 3, borderWidth: 2 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#b0bec5', font: { size: 10 }, usePointStyle: true } } },
                scales: {
                    x: { grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#78909c', font: { size: 9 } } },
                    y: { grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#78909c', font: { size: 9 } }, min: 20, max: 100, title: { display: true, text: 'Humedad (%)', color: '#78909c', font: { size: 10 } } }
                }
            }
        });
    }
    
    const balanceChart = document.getElementById('reporteBalanceChart');
    if (balanceChart) {
        reporteChartInstances.balance = new Chart(balanceChart, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Balance Hídrico Acumulado (mm)', data: balance, backgroundColor: balance.map(b => b >= 0 ? 'rgba(46, 204, 113, 0.7)' : 'rgba(231, 76, 60, 0.7)'), borderColor: balance.map(b => b >= 0 ? '#27ae60' : '#e74c3c'), borderWidth: 1, borderRadius: 4, order: 2 },
                    { label: 'Precipitación Diaria (mm)', data: precip, backgroundColor: 'rgba(52, 152, 219, 0.4)', borderColor: '#3498db', borderWidth: 1, borderRadius: 4, order: 1, type: 'bar' }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#b0bec5', font: { size: 10 }, usePointStyle: true } },
                    tooltip: { callbacks: { label: function(context) { return `${context.dataset.label}: ${formatNumber(context.parsed.y)} mm`; } } }
                },
                scales: {
                    x: { grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#78909c', font: { size: 9 } } },
                    y: { grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'mm', color: '#78909c', font: { size: 10 } } }
                }
            }
        });
    }
    
    const radChart = document.getElementById('reporteRadChart');
    if (radChart) {
        reporteChartInstances.rad = new Chart(radChart, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{ label: 'Radiación Solar Promedio (W/m²)', data: rad, borderColor: '#ff2c06', backgroundColor: 'rgba(249, 119, 80, 0.15)', fill: true, tension: 0.3, pointRadius: 1, borderWidth: 2.5 }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#b0bec5', font: { size: 10 }, usePointStyle: true } } },
                scales: {
                    x: { grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#78909c', font: { size: 9 } } },
                    y: { grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'W/m²', color: '#78909c', font: { size: 10 } } }
                }
            }
        });
    }
    
    const distChart = document.getElementById('reporteDistChart');
    if (distChart) {
        const rangosTemp = [{ label: '<18°C', min: 0, max: 18 }, { label: '18-21°C', min: 18, max: 21 }, { label: '21-24°C', min: 21, max: 24 }, { label: '24-27°C', min: 24, max: 27 }, { label: '>27°C', min: 27, max: 100 }];
        const distribTemp = rangosTemp.map(r => datos.filter(d => d.tempMean >= r.min && d.tempMean < r.max).length);
        reporteChartInstances.dist = new Chart(distChart, {
            type: 'bar',
            data: {
                labels: rangosTemp.map(r => r.label),
                datasets: [{ label: 'Días por Rango de Temperatura', data: distribTemp, backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#e67e22', '#e74c3c'], borderColor: ['#2980b9', '#27ae60', '#d68910', '#d35400', '#c0392b'], borderWidth: 1, borderRadius: 6 }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#b0bec5', font: { size: 10 }, usePointStyle: true } },
                    tooltip: { callbacks: { label: function(context) { return `${context.parsed.y} días`; } } }
                },
                scales: {
                    x: { grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'Rango de Temperatura', color: '#78909c', font: { size: 10 } } },
                    y: { grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'Número de Días', color: '#78909c', font: { size: 10 } }, beginAtZero: true }
                }
            }
        });
    }
}

function exportarReportePDF() {
    if (!reporteData) { alert('Primero genera un reporte'); return; }
    const contenido = document.getElementById('reporteResultados');
    if (!contenido) { alert('No hay contenido para exportar'); return; }
    const html = generarHTMLReporteCompleto(contenido);
    descargarReporte(html, 'reporte_trazabilidad');
}

function generarHTMLReporteCompleto(contenido) {
    const { fechaInicio, fechaFin, estacionNombre, cultivoInfo, datos } = reporteData || {};
    return `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><title>Reporte de Trazabilidad - AgroMonitor</title>
        <link rel="stylesheet" href="styles/style.css">
        <style>
            body { background: white; padding: 30px; font-family: 'Inter', sans-serif; }
            .sidebar { display: none; } .main-content { margin-left: 0; } .top-header { position: static; }
            .reporte-controls, .btn-refresh, .period-selector, .btn-chart, .btn-primary, .btn-secondary, .sidebar, .top-header { display: none !important; }
            .reporte-cabecera { display: block !important; } .reporte-stats-grid { display: grid !important; }
            .reporte-charts-grid { display: grid !important; } .table-card-reporte { display: block !important; }
            #reporteResultados { display: block !important; }
            .kpi-card, .chart-card, .estacion-card { background: #f8f9fa; border-color: #dee2e6; box-shadow: none !important; }
            .chart-body canvas { max-height: 280px; }
            @media print { body { padding: 15px; } .no-print { display: none; } }
        </style>
        </head>
        <body>
            <div style="max-width: 1200px; margin: 0 auto;">
                <div style="text-align: center; padding: 20px 0; border-bottom: 3px solid #27ae60; margin-bottom: 30px;">
                    <h1 style="color: #2c3e50; font-size: 28px;">🌱 AgroMonitor Pro</h1>
                    <h2 style="color: #27ae60; font-size: 18px; margin: 4px 0;">Reporte de Producción y Trazabilidad</h2>
                    <p style="color: #6c757d; font-size: 14px;">
                        ${estacionNombre || 'Todas las estaciones'} · ${cultivoInfo ? `${cultivoInfo.icono} ${cultivoInfo.nombre}` : 'Múltiples cultivos'} · ${formatDateOnly(fechaInicio)} - ${formatDateOnly(fechaFin)}
                    </p>
                    <p style="color: #6c757d; font-size: 12px;">${datos?.length || 0} registros · Generado: ${new Date().toLocaleString('es-PE')}</p>
                </div>
                ${contenido.innerHTML}
                <div style="text-align: center; padding: 20px; margin-top: 30px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 11px;">
                    <p>🌱 Agricultura Sostenible · Trazabilidad Total · Datos en tiempo real</p>
                    <p>AgroMonitor Pro v3.0 · ${new Date().toLocaleString('es-PE')}</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

function descargarReporte(html, nombre) {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombre}_${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================================================
// FUNCIONES DE TRAZABILIDAD - CON LÍNEAS VERTICALES Y FECHAS
// ============================================================================

let trazabilidadChartInstances = {};
let trazabilidadDataGlobal = null;
let trazabilidadDateRanges = {};

const customVerticalStagePlugin = {
    id: 'customVerticalStagePlugin',
    afterDatasetsDraw(chart, args, pluginOptions) {
        if (!chart || !chart.scales || !chart.scales.x || !chart.chartArea) return;
        const stages = pluginOptions && Array.isArray(pluginOptions.stages) ? pluginOptions.stages : [];
        if (!stages.length) return;

        const { ctx, chartArea, scales } = chart;
        const xScale = scales.x;
        if (!xScale) return;

        ctx.save();
        stages.forEach((etapa, index) => {
            const valueIndex = Number(etapa.index);
            if (!Number.isFinite(valueIndex) || valueIndex < 0 || valueIndex >= chart.data.labels.length) return;

            const x = xScale.getPixelForValue(valueIndex);
            if (x < chartArea.left || x > chartArea.right) return;

            ctx.beginPath();
            ctx.moveTo(x, chartArea.top);
            ctx.lineTo(x, chartArea.bottom);
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = etapa.color || '#27ae60';
            ctx.lineWidth = 2.5;
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = etapa.color || '#27ae60';
            ctx.font = 'bold 9px Inter, sans-serif';
            ctx.textBaseline = 'top';
            ctx.fillText(etapa.label, Math.min(x + 6, chartArea.right - 80), chartArea.top + 8 + (index % 3) * 12);
        });
        ctx.restore();
    }
};

if (typeof Chart !== 'undefined' && Chart.register) {
    try {
        const existing = Chart.registry && Chart.registry.plugins ? Chart.registry.plugins.get('customVerticalStagePlugin') : null;
        if (!existing) {
            Chart.register(customVerticalStagePlugin);
        }
    } catch (e) { console.warn('Plugin de etapas no disponible:', e); }
}

const ETAPAS_CAFE = [
    { id: 'botonFloral', label: '🌱 Botón Floral', color: '#2ecc71', colorBg: 'rgba(46, 204, 113, 0.15)' },
    { id: 'floracion', label: '🌸 Floración', color: '#f1c40f', colorBg: 'rgba(241, 196, 15, 0.15)' },
    { id: 'llenadoFruto', label: '🌿 Llenado de Fruto', color: '#e67e22', colorBg: 'rgba(230, 126, 34, 0.15)' },
    { id: 'maduracion', label: '🍒 Maduración', color: '#e74c3c', colorBg: 'rgba(231, 76, 60, 0.15)' },
    { id: 'cosecha', label: '☕ Cosecha', color: '#8e44ad', colorBg: 'rgba(142, 68, 173, 0.15)' }
];

function getFechasPredeterminadas() {
    const year = new Date().getFullYear();
    return {
        botonFloral: new Date(year, 0, 15),
        floracion: new Date(year, 2, 1),
        llenadoFruto: new Date(year, 4, 1),
        maduracion: new Date(year, 7, 15),
        cosecha: new Date(year, 10, 1)
    };
}

function inicializarTrazabilidadSelectores() {
    const selector = document.getElementById('trazabilidadEstacionSelector');
    if (!selector) return;
    selector.innerHTML = '<option value="">🔽 Selecciona una estación...</option>';
    const estacionesDisponibles = Object.keys(ESTACIONES)
        .filter(nombre => !ESTACIONES[nombre].isVirtual);
    estacionesDisponibles.forEach(nombre => {
        const est = ESTACIONES[nombre];
        const option = document.createElement('option');
        option.value = nombre;
        option.textContent = `${est.emoji || '📍'} ${nombre} (${est.cultivo.toUpperCase()})`;
        option.style.color = est.color || '#27ae60';
        selector.appendChild(option);
    });

    const inputInicio = document.getElementById('trazabilidadFechaInicio');
    const inputFin = document.getElementById('trazabilidadFechaFin');
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - 30);

    const estacionPredeterminada = estacionesDisponibles[0] || '';
    if (selector && estacionPredeterminada) {
        selector.value = estacionPredeterminada;
        trazabilidadDateRanges[estacionPredeterminada] = {
            inicio: new Date(fechaInicio.getTime()),
            fin: new Date(fechaFin.getTime())
        };
    }

    if (inputInicio) inputInicio.value = formatDateInput(fechaInicio);
    if (inputFin) inputFin.value = formatDateInput(fechaFin);

    const predeterminadas = getFechasPredeterminadas();
    const ids = ['botonFloral', 'floracion', 'llenadoFruto', 'maduracion', 'cosecha'];
    ids.forEach(key => {
        const input = document.getElementById(`etapa${capitalizeFirstLetter(key)}`);
        if (input && predeterminadas[key]) {
            input.value = formatDateInput(predeterminadas[key]);
        }
    });
}

function getEtapasDesdeInputs() {
    const etapas = {};
    const ids = ['botonFloral', 'floracion', 'llenadoFruto', 'maduracion', 'cosecha'];
    ids.forEach(id => {
        const input = document.getElementById(`etapa${capitalizeFirstLetter(id)}`);
        if (input && input.value) {
            const date = parseDateInput(input.value);
            if (date) etapas[id] = date;
        }
    });
    return etapas;
}

function getEtapasParaGrafica(diarioData) {
    if (!diarioData || diarioData.length === 0) return [];
    const etapas = getEtapasDesdeInputs();
    const fechas = diarioData.map(d => d.fecha);
    const result = [];
    const etapasOrdenadas = ETAPAS_CAFE
        .filter(e => etapas[e.id])
        .map(e => ({ ...e, fecha: etapas[e.id] }))
        .sort((a, b) => a.fecha - b.fecha);
    etapasOrdenadas.forEach(etapa => {
        let idx = fechas.findIndex(d => d >= etapa.fecha);
        if (idx === -1) idx = fechas.length - 1;
        if (idx >= 0) result.push({ ...etapa, index: idx, fecha: etapa.fecha, fechaStr: formatDateOnly(etapa.fecha) });
    });
    return result;
}

function getEtapaForDate(fecha, etapasInfo) {
    if (!etapasInfo || etapasInfo.length === 0) {
        return { id: 'pre-floral', label: '🌱 Pre-Floral', class: 'pre-floral' };
    }
    for (let i = 0; i < etapasInfo.length; i++) {
        const e = etapasInfo[i];
        if (fecha >= e.fecha) {
            if (i < etapasInfo.length - 1 && fecha < etapasInfo[i + 1].fecha) {
                return { id: e.id, label: e.label, class: e.id.replace(/([A-Z])/g, '-$1').toLowerCase() };
            } else if (i === etapasInfo.length - 1) {
                return { id: e.id, label: e.label, class: e.id.replace(/([A-Z])/g, '-$1').toLowerCase() };
            }
        }
    }
    if (etapasInfo.length > 0 && fecha < etapasInfo[0].fecha) {
        return { id: 'pre-floral', label: '🌱 Pre-Floral', class: 'pre-floral' };
    }
    return { id: 'pre-floral', label: '🌱 Pre-Floral', class: 'pre-floral' };
}

function guardarRangoFechasTrazabilidad(nombreEstacion, fechaInicio, fechaFin) {
    if (!nombreEstacion) return;
    trazabilidadDateRanges[nombreEstacion] = {
        inicio: fechaInicio instanceof Date && !isNaN(fechaInicio) ? new Date(fechaInicio.getTime()) : null,
        fin: fechaFin instanceof Date && !isNaN(fechaFin) ? new Date(fechaFin.getTime()) : null
    };
}

function aplicarRangoFechasTrazabilidad(nombreEstacion) {
    const inputInicio = document.getElementById('trazabilidadFechaInicio');
    const inputFin = document.getElementById('trazabilidadFechaFin');
    if (!inputInicio || !inputFin) return;

    const guardado = nombreEstacion ? trazabilidadDateRanges[nombreEstacion] : null;
    const fechaFin = guardado && guardado.fin ? new Date(guardado.fin.getTime()) : new Date();
    const fechaInicio = guardado && guardado.inicio ? new Date(guardado.inicio.getTime()) : (() => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return d;
    })();

    inputInicio.value = formatDateInput(fechaInicio);
    inputFin.value = formatDateInput(fechaFin);
}

async function cargarDatosTrazabilidad() {
    const selector = document.getElementById('trazabilidadEstacionSelector');
    const nombreEstacion = selector ? selector.value : '';
    if (!nombreEstacion) { alert('Por favor, selecciona una estación'); return; }
    const estacion = ESTACIONES[nombreEstacion];
    if (!estacion) { alert('Estación no encontrada'); return; }
    
    const inputInicio = document.getElementById('trazabilidadFechaInicio');
    const inputFin = document.getElementById('trazabilidadFechaFin');
    if (!inputInicio || !inputInicio.value || !inputFin || !inputFin.value) {
        alert('Por favor, selecciona un rango de fechas');
        return;
    }
    const fechaInicio = parseDateInput(inputInicio.value);
    const fechaFin = parseDateInput(inputFin.value);
    if (!fechaInicio || !fechaFin) {
        alert('El rango de fechas no es válido');
        return;
    }
    if (fechaInicio > fechaFin) { alert('La fecha de inicio no puede ser mayor a la fecha final'); return; }
    guardarRangoFechasTrazabilidad(nombreEstacion, fechaInicio, fechaFin);
    const diasDiff = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
    if (diasDiff < 1) { alert('El rango de fechas debe ser de al menos 1 día'); return; }
    
    const btnRefresh = document.getElementById('trazabilidadBtnRefresh');
    if (btnRefresh) {
        btnRefresh.disabled = true;
        btnRefresh.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
    }
    try {
        console.log(`📡 Cargando datos de trazabilidad para ${nombreEstacion} (${diasDiff} días)...`);
        const datos = await fetchStationData(estacion.channel_id, estacion.api_key, diasDiff + 5, fechaInicio, fechaFin);
        if (datos.length === 0) { alert('No se obtuvieron datos de la estación para el rango seleccionado'); return; }
        const datosFiltrados = datos.filter(d => d.timestamp >= fechaInicio && d.timestamp <= fechaFin);
        if (datosFiltrados.length === 0) { alert('No hay datos en el rango de fechas seleccionado'); return; }
        console.log(`✅ Obtenidos ${datosFiltrados.length} registros de ${nombreEstacion}`);
        const procesado = calcularIndicadoresDiarios(datosFiltrados);
        if (!procesado || !procesado.diario || procesado.diario.length === 0) {
            alert('Error al procesar los datos');
            return;
        }
        const diario = procesado.diario;
        const horarios = procesado.horarios;
        const diarioConNocturna = diario.map(d => {
            const horariosDia = horarios.filter(h => h.timestamp.toDateString() === d.fecha.toDateString());
            const nocturnos = horariosDia.filter(h => { const hora = h.timestamp.getHours(); return hora >= 20 || hora < 6; });
            const tempNocturna = nocturnos.length > 0 ? nocturnos.reduce((sum, h) => sum + h.temperatura, 0) / nocturnos.length : d.tempMean;
            return { ...d, tempNocturna };
        });
        const horasSobre90 = diario.map(d => {
            const horariosDia = horarios.filter(h => h.timestamp.toDateString() === d.fecha.toDateString());
            const count = horariosDia.filter(h => h.humedad > 90).length;
            return (count * 10) / 60;
        });
        let gddAcum = 0;
        diarioConNocturna.forEach(d => { gddAcum += d.gdd; d.gddAcumulado = gddAcum; });
        const gddTotal = gddAcum;
        const calidad = calcularCalidad(diarioConNocturna, gddTotal, estacion.cultivo);
        trazabilidadDataGlobal = {
            diario: diarioConNocturna,
            horarios: horarios,
            horasSobre90: horasSobre90,
            gddTotal: gddTotal,
            calidad: calidad,
            estacion: estacion,
            nombre: nombreEstacion,
            color: estacion.color || '#27ae60',
            cultivo: estacion.cultivo || 'cafe',
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            dias: diasDiff
        };
        console.log(`✅ Datos de trazabilidad procesados: ${diarioConNocturna.length} días`);
        renderTrazabilidadCompleta();
    } catch (error) {
        console.error('❌ Error al cargar datos de trazabilidad:', error);
        alert('Error al cargar los datos: ' + error.message);
    } finally {
        if (btnRefresh) {
            btnRefresh.disabled = false;
            btnRefresh.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
        }
    }
}

function renderTrazabilidadCompleta() {
    if (!trazabilidadDataGlobal) { console.warn('⚠️ No hay datos de trazabilidad para renderizar'); return; }
    const { diario, horarios, horasSobre90, estacion, color, cultivo, nombre, fechaInicio, fechaFin, dias } = trazabilidadDataGlobal;
    const etapasInfo = getEtapasParaGrafica(diario);
    const tableInfo = document.getElementById('trazabilidadTableInfo');
    if (tableInfo) {
        const periodoStr = `${formatDateOnly(fechaInicio)} - ${formatDateOnly(fechaFin)}`;
        tableInfo.textContent = `${diario.length} días · ${cultivo ? cultivo.toUpperCase() : 'CAFE'} · ${periodoStr}`;
    }
    renderTrazabilidadTabla(diario, etapasInfo);
    renderTrazabilidadGraficas(diario, horarios, horasSobre90, estacion, etapasInfo);
    generarInterpretacionTrazabilidad();
    console.log(`✅ Trazabilidad renderizada con ${etapasInfo.length} etapas fenológicas`);
}

function obtenerTablaDuracionEtapasFenologicas() {
    if (!trazabilidadDataGlobal || !trazabilidadDataGlobal.diario || trazabilidadDataGlobal.diario.length === 0) {
        return [];
    }

    const inicio = trazabilidadDataGlobal.fechaInicio ? new Date(trazabilidadDataGlobal.fechaInicio) : trazabilidadDataGlobal.diario[0].fecha;
    const fin = trazabilidadDataGlobal.fechaFin ? new Date(trazabilidadDataGlobal.fechaFin) : trazabilidadDataGlobal.diario[trazabilidadDataGlobal.diario.length - 1].fecha;
    const etapasMapa = getEtapasDesdeInputs();
    const etapasOrdenadas = ETAPAS_CAFE
        .map(etapa => {
            const fecha = etapasMapa[etapa.id];
            if (!fecha || Number.isNaN(new Date(fecha).getTime())) return null;
            const fechaObj = new Date(fecha);
            if (fechaObj > fin) return null;
            return { ...etapa, fecha: fechaObj };
        })
        .filter(Boolean)
        .sort((a, b) => a.fecha - b.fecha);

    if (etapasOrdenadas.length === 0) {
        return [{
            etapa: '🌱 Ciclo productivo',
            inicio: formatDateOnly(inicio),
            fin: formatDateOnly(fin),
            duracion: `${Math.max(1, Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)))} días`,
            desarrollo: 'Seguimiento general de la campaña'
        }];
    }

    const filas = [];
    for (let i = 0; i < etapasOrdenadas.length; i++) {
        const etapa = etapasOrdenadas[i];
        const siguiente = etapasOrdenadas[i + 1];
        let finalFecha = siguiente ? new Date(siguiente.fecha) : new Date(fin);
        if (!Number.isFinite(finalFecha.getTime()) || finalFecha <= etapa.fecha) {
            finalFecha = new Date(etapa.fecha.getTime() + 86400000);
        }
        if (finalFecha > fin) finalFecha = new Date(fin);
        const diferenciaDias = Math.max(1, Math.ceil((finalFecha - etapa.fecha) / (1000 * 60 * 60 * 24)));
        filas.push({
            etapa: etapa.label,
            inicio: formatDateOnly(etapa.fecha),
            fin: formatDateOnly(finalFecha),
            duracion: `${diferenciaDias} días`,
            desarrollo: i === 0 ? 'Inicio del ciclo' : i === etapasOrdenadas.length - 1 ? 'Etapa final de producción' : 'Desarrollo acumulativo'
        });
    }

    return filas;
}

function obtenerInterpretacionEspecialistaTrazabilidad() {
    const contexto = obtenerContextoInterpretacionTrazabilidad();
    if (!contexto) return 'No hay datos disponibles para generar la interpretación agronómica.';

    const { nombre, cultivo, periodo, tempMean, tempMax, tempMin, humedadMean, humedadMax, humedadMin, precipTotal, radiacionMean, vpdProm, horasRiesgo, gddTotal, etapaActual } = contexto;

    const estadoTermico = tempMean >= 18 && tempMean <= 24 ? 'térmico favorable para la fase productiva' : tempMean > 24 ? 'calor moderado-alto que exige mayor vigilancia en maduración' : 'temperaturas relativamente frescas con desarrollo más conservador';
    const estadoHumedad = humedadMean > 75 ? 'humedad elevada, con presión sanitaria incrementada' : humedadMean < 60 ? 'humedad baja y mayor exigencia hídrica' : 'humedad en rango útil para la dinámica del lote';
    const riesgoFitosanitario = horasRiesgo > 12 ? 'elevado' : horasRiesgo > 5 ? 'moderado' : 'bajo';
    const tensionVPD = vpdProm > 1.2 ? 'algún estrés atmosférico en la fase de desarrollo' : vpdProm < 0.8 ? 'condiciones más conservadoras y menor demanda atmosférica' : 'condiciones atmosféricas equilibradas';
    const calidadEsperada = tempMean >= 18 && tempMean <= 23 && humedadMean >= 65 && humedadMean <= 75 ? 'perfil sensorial más estable, tendencia a acidez brillante y cuerpo redondo' : 'perfil sensorial susceptible a variabilidad por estrés térmico o humedad';

    return `
        <strong>Estación:</strong> ${nombre}<br>
        <strong>Periodo:</strong> ${periodo}<br>
        <strong>Diagnóstico técnico:</strong> El lote presenta un régimen ${estadoTermico} con humedad relativa en condición ${estadoHumedad}. La temperatura promedio fue <strong>${formatNumber(tempMean, 1)}°C</strong> (máx. <strong>${formatNumber(tempMax, 1)}°C</strong>, mín. <strong>${formatNumber(tempMin, 1)}°C</strong>) y la humedad relativa media fue <strong>${formatNumber(humedadMean, 0)}%</strong> (máx. <strong>${formatNumber(humedadMax, 0)}%</strong>, mín. <strong>${formatNumber(humedadMin, 0)}%</strong>). La precipitación acumulada fue <strong>${formatNumber(precipTotal, 1)} mm</strong>, la radiación promedio <strong>${formatNumber(radiacionMean, 0)} W/m²</strong>, el VPD promedio <strong>${formatNumber(vpdProm, 2)} kPa</strong> y el GDD acumulado <strong>${formatNumber(gddTotal, 1)}</strong>.<br>
        <ul>
            <li><strong>Etapa fenológica:</strong> ${etapaActual}.</li>
            <li><strong>Riesgo fitosanitario:</strong> ${riesgoFitosanitario} con <strong>${horasRiesgo}</strong> horas por encima de 90% de humedad relativa.</li>
            <li><strong>Implicaación en trazabilidad y calidad:</strong> ${tensionVPD}, con efecto directo sobre la uniformidad de maduración, el potencial sensorial y la trazabilidad de la calidad del lote.</li>
            <li><strong>Perfil esperado del café:</strong> ${calidadEsperada}. Se recomienda vigilar VPD, ventilación y manejo sanitario en los periodos de humedad elevada.</li>
        </ul>
    `;
}

function generarFichaTecnicaTrazabilidad(previewId = 'trazabilidadFichaPreview') {
    const preview = document.getElementById(previewId);
    if (!preview) return;

    const contexto = obtenerContextoInterpretacionTrazabilidad();
    if (!contexto || !trazabilidadDataGlobal || !trazabilidadDataGlobal.diario || trazabilidadDataGlobal.diario.length === 0) {
        preview.classList.add('empty');
        preview.textContent = 'Primero selecciona una estación y carga la trazabilidad para previsualizar la ficha técnica.';
        return;
    }

    const etapaActual = getEtapaForDate(new Date(), getEtapasParaGrafica(trazabilidadDataGlobal.diario));
    const resumen = obtenerInterpretacionEspecialistaTrazabilidad();
    const tablaEtapas = obtenerTablaDuracionEtapasFenologicas();
    const chartIds = ['trazabilidadMainChart', 'trazabilidadTempChart', 'trazabilidadHumChart'];
    const chartMarkup = chartIds
        .map(id => {
            const canvas = document.getElementById(id);
            if (!canvas) return '';
            const dataUrl = canvas.toDataURL('image/png');
            return dataUrl ? `<div class="trazabilidad-ficha-chart"><img src="${dataUrl}" alt="Gráfica de trazabilidad ${id}" /></div>` : '';
        })
        .join('');

    const tablaHtml = tablaEtapas.length > 0
        ? `
            <table>
                <thead>
                    <tr>
                        <th>Etapa</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                        <th>Duración</th>
                        <th>Desarrollo</th>
                    </tr>
                </thead>
                <tbody>
                    ${tablaEtapas.map(fila => `
                        <tr>
                            <td>${fila.etapa}</td>
                            <td>${fila.inicio}</td>
                            <td>${fila.fin}</td>
                            <td>${fila.duracion}</td>
                            <td>${fila.desarrollo}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `
        : '<p>No se configuraron etapas para esta campaña.</p>';

    const html = `
        <div class="reporte-pdf-document">
            <div class="reporte-pdf-header">
                <h3>📄 Ficha técnica de trazabilidad ambiental</h3>
                <p>Estación: ${contexto.nombre} • Cultivo: ${contexto.cultivo.toUpperCase()} • Período: ${contexto.periodo}</p>
            </div>

            <div class="trazabilidad-ficha-summary">
                <div class="trazabilidad-ficha-summary-item"><strong>Temperatura media</strong><span>${formatNumber(contexto.tempMean, 1)}°C</span></div>
                <div class="trazabilidad-ficha-summary-item"><strong>Humedad media</strong><span>${formatNumber(contexto.humedadMean, 0)}%</span></div>
                <div class="trazabilidad-ficha-summary-item"><strong>Precipitación total</strong><span>${formatNumber(contexto.precipTotal, 1)} mm</span></div>
                <div class="trazabilidad-ficha-summary-item"><strong>GDD acumulado</strong><span>${formatNumber(contexto.gddTotal, 1)}</span></div>
                <div class="trazabilidad-ficha-summary-item"><strong>Etapa actual</strong><span>${etapaActual.label || contexto.etapaActual}</span></div>
                <div class="trazabilidad-ficha-summary-item"><strong>Registros</strong><span>${trazabilidadDataGlobal.diario.length}</span></div>
            </div>

            <div class="reporte-pdf-section">
                <h4>🔎 Diagnóstico técnico de trazabilidad ambiental</h4>
                <div class="reporte-pdf-interpretacion">${resumen}</div>
            </div>

            <div class="reporte-pdf-section">
                <h4>🌱 Duración de etapas fenológicas y desarrollo del cultivo</h4>
                ${tablaHtml}
            </div>

            <div class="reporte-pdf-section">
                <h4>📊 Gráficas de trazabilidad</h4>
                <div class="trazabilidad-ficha-grid">${chartMarkup}</div>
            </div>
        </div>
    `;

    preview.classList.remove('empty');
    preview.innerHTML = html;
}

function exportarFichaAgronomicaPdf() {
    const preview = document.getElementById('fichaAgronomicaPreview');
    const doc = preview ? preview.querySelector('.ficha-tecnica-document') : null;
    if (!doc) {
        alert('Primero genera la ficha técnica agronómica para exportarla a PDF.');
        return;
    }

    const printWindow = window.open('', '_blank', 'width=1200,height=900');
    if (!printWindow) {
        alert('El navegador bloqueó la ventana de impresión. Permite las ventanas emergentes para exportar la ficha a PDF.');
        return;
    }

    const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Ficha Técnica Agronómica</title>
            <style>
                html, body { margin: 0; padding: 20px; background: #f4f8f5; color: #1f2a1f; font-family: Arial, sans-serif; }
                body { display: flex; justify-content: center; }
                .ficha-tecnica-document { max-width: 1100px; width: 100%; background: #fff; border: 1px solid #dfeee1; border-radius: 16px; padding: 22px; box-shadow: 0 6px 18px rgba(12, 36, 24, 0.08); }
                .ficha-header { display: flex; align-items: center; gap: 16px; background: linear-gradient(135deg, #184d2d, #113b28); color: #fff; padding: 16px 20px; border-radius: 14px; }
                .ficha-logo-wrap img { width: 72px; height: 72px; object-fit: contain; background: rgba(255,255,255,0.08); border-radius: 12px; padding: 6px; }
                .ficha-header-copy h1 { margin: 0 0 6px; font-size: 1.8rem; }
                .ficha-header-copy p { margin: 0; opacity: 0.9; }
                .ficha-summary { margin-top: 18px; }
                .ficha-summary table, .ficha-panel table { width: 100%; border-collapse: collapse; }
                .ficha-summary th, .ficha-summary td, .ficha-panel th, .ficha-panel td { border: 1px solid #dfeee1; padding: 10px 12px; text-align: left; }
                .ficha-summary th, .ficha-panel th { background: #edf6ee; }
                .ficha-panel { margin-top: 18px; border: 1px solid #dfeee1; border-radius: 12px; padding: 18px; }
                .ficha-panel h3 { margin: 0 0 12px; color: #184d2d; }
                .ficha-interpretacion { line-height: 1.7; }
                .ficha-chart-grid { display: grid; grid-template-columns: repeat(2, minmax(260px, 1fr)); gap: 18px; margin-top: 10px; }
                .ficha-plot-card img { display: block; width: 100%; height: auto; border-radius: 10px; }
                .ficha-grafica-resultado { margin-top: 12px; padding: 10px 12px; border-left: 4px solid #2f8f5b; background: #f3faf5; border-radius: 8px; line-height: 1.6; color: #234c39; }
                .ficha-footer { display: flex; align-items: center; gap: 10px; margin-top: 18px; padding-top: 12px; border-top: 1px solid #dfeee1; font-size: 0.8rem; color: #536b5a; }
                .ficha-footer img { width: 44px; height: 44px; }
                @media print { body { background: #fff; } .ficha-chart-grid { grid-template-columns: 1fr; } }
            </style>
        </head>
        <body>
            ${doc.outerHTML}
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
}

function generarFichaTecnicaAutomatica() {
    if (!trazabilidadDataGlobal || !trazabilidadDataGlobal.diario || trazabilidadDataGlobal.diario.length === 0) {
        return {
            html: '',
            metadata: {
                lote_id: 'N/D',
                estacion: 'N/D',
                generado_en: new Date().toISOString(),
                version_prompt: '1.0.0'
            }
        };
    }

    const contexto = obtenerContextoInterpretacionTrazabilidad();
    if (!contexto) { return { html: '', metadata: { lote_id: 'N/D', estacion: 'N/D', generado_en: new Date().toISOString(), version_prompt: '1.0.0' } }; }

    const fechaInicio = trazabilidadDataGlobal.fechaInicio || trazabilidadDataGlobal.diario[0]?.fecha || new Date();
    const fechaFin = trazabilidadDataGlobal.fechaFin || trazabilidadDataGlobal.diario[trazabilidadDataGlobal.diario.length - 1]?.fecha || new Date();
    const nombreEstacion = trazabilidadDataGlobal.nombre || trazabilidadDataGlobal.estacion?.nombre || 'Estación sin nombre';
    const variedad = trazabilidadDataGlobal.variedad || trazabilidadDataGlobal.cultivo || 'Café';
    const altitud = trazabilidadDataGlobal.altitud || trazabilidadDataGlobal.estacion?.altitud || 'N/D';
    const lat = trazabilidadDataGlobal.coordenadas?.lat ?? trazabilidadDataGlobal.estacion?.lat ?? 'N/D';
    const lon = trazabilidadDataGlobal.coordenadas?.lon ?? trazabilidadDataGlobal.estacion?.lon ?? 'N/D';
    const loteId = trazabilidadDataGlobal.lote_id || trazabilidadDataGlobal.loteId || `lote_${Date.now()}`;
    const etapaActual = getEtapaForDate(new Date(), getEtapasParaGrafica(trazabilidadDataGlobal.diario));
    const tablaEtapas = obtenerTablaDuracionEtapasFenologicas();
    const fechaEmision = new Date().toISOString();

    const chartMap = {
        trazabilidadMainChart: trazabilidadChartInstances.main,
        trazabilidadTempChart: trazabilidadChartInstances.temp,
        trazabilidadHumChart: trazabilidadChartInstances.hum,
        trazabilidadPrecipRadChart: trazabilidadChartInstances.precipRad,
        trazabilidadNightChart: trazabilidadChartInstances.night,
        trazabilidadVpdChart: trazabilidadChartInstances.vpd,
        trazabilidadHoras90Chart: trazabilidadChartInstances.horas90
    };

    const labels = trazabilidadDataGlobal.diario.map(d => formatDateOnly(d.fecha));
    const chartDefinitions = {
        trazabilidadMainChart: {
            type: 'line',
            data: { labels, datasets: [
                { label: 'Temperatura Promedio (°C)', data: trazabilidadDataGlobal.diario.map(d => d.tempMean), borderColor: '#e74c3c', backgroundColor: 'rgba(231, 76, 60, 0.05)', fill: true, tension: 0.3, pointRadius: 1, borderWidth: 2, yAxisID: 'y' },
                { label: 'Humedad Promedio (%)', data: trazabilidadDataGlobal.diario.map(d => d.humedadMean), borderColor: '#3498db', backgroundColor: 'rgba(52, 152, 219, 0.05)', fill: true, tension: 0.3, pointRadius: 1, borderWidth: 2, yAxisID: 'y1' },
                { label: 'GDD Acumulado', data: trazabilidadDataGlobal.diario.map(d => d.gddAcumulado || 0), borderColor: '#27ae60', backgroundColor: 'rgba(46, 204, 113, 0.05)', fill: true, tension: 0.3, pointRadius: 1, borderWidth: 2, borderDash: [3, 3], yAxisID: 'y2' }
            ] },
            options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { labels: { color: '#b0bec5', font: { size: 10 }, usePointStyle: true } } }, scales: { x: { grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#78909c', font: { size: 9 }, maxTicksLimit: 30 } }, y: { position: 'left', grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'Temperatura (°C)', color: '#78909c', font: { size: 10 } } }, y1: { position: 'right', grid: { display: false }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'Humedad (%)', color: '#78909c', font: { size: 10 } }, min: 20, max: 100 }, y2: { position: 'right', grid: { display: false }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'GDD', color: '#78909c', font: { size: 10 } }, display: false } } }
        },
        trazabilidadTempChart: {
            type: 'line',
            data: { labels, datasets: [
                { label: 'Máxima Diaria', data: trazabilidadDataGlobal.diario.map(d => d.tempMax), borderColor: '#b31504', backgroundColor: 'rgba(251, 250, 250, 0.1)', fill: true, tension: 0.3, pointRadius: 1.2, borderWidth: 1 },
                { label: 'Promedio Diario', data: trazabilidadDataGlobal.diario.map(d => d.tempMean), borderColor: '#fe1e00', backgroundColor: 'transparent', fill: false, tension: 0.3, pointRadius: 1.2, borderWidth: 1, borderDash: [3, 3] },
                { label: 'Mínima Diaria', data: trazabilidadDataGlobal.diario.map(d => d.tempMin), borderColor: '#ff9e03', backgroundColor: 'rgba(252, 252, 252, 0.1)', fill: true, tension: 0.3, pointRadius: 1.2, borderWidth: 1 }
            ] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#303131', font: { size: 10 }, usePointStyle: true } } }, scales: { x: { grid: { color: 'rgba(255, 255, 255, 0.08)' }, ticks: { color: '#303131', font: { size: 9 } } }, y: { grid: { color: 'rgba(250, 250, 251, 0.08)' }, ticks: { color: '#303131', font: { size: 9 } }, title: { display: true, text: 'Temperatura (°C)', color: '#303131', font: { size: 10 } } } } }
        },
        trazabilidadHumChart: {
            type: 'line',
            data: { labels, datasets: [
                { label: 'Máxima Diaria', data: trazabilidadDataGlobal.diario.map(d => d.humedadMax), borderColor: '#0669ab', backgroundColor: 'rgba(250, 250, 251, 0.1)', fill: true, tension: 0.3, pointRadius: 1.2, borderWidth: 1 },
                { label: 'Promedio Diario', data: trazabilidadDataGlobal.diario.map(d => d.humedadMean), borderColor: '#1c9cb3', backgroundColor: 'transparent', fill: false, tension: 0.3, pointRadius: 1.2, borderWidth: 1, borderDash: [1, 1] },
                { label: 'Mínima Diaria', data: trazabilidadDataGlobal.diario.map(d => d.humedadMin), borderColor: '#77c4c4', backgroundColor: 'rgba(253, 253, 253, 0.1)', fill: true, tension: 0.3, pointRadius: 1.2, borderWidth: 1 }
            ] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#303131', font: { size: 10 }, usePointStyle: true } } }, scales: { x: { grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#303131', font: { size: 9 } } }, y: { grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#303131', font: { size: 9 } }, min: 20, max: 100, title: { display: true, text: 'Humedad (%)', color: '#303131', font: { size: 10 } } } } }
        },
        trazabilidadPrecipRadChart: {
            type: 'bar',
            data: { labels, datasets: [
                { label: 'Precipitación (mm)', data: trazabilidadDataGlobal.diario.map(d => d.precipitacion), backgroundColor: 'rgba(0, 130, 153, 0.98)', borderColor: '#f9f9f9', borderWidth: 1, borderRadius: 4, order: 2, yAxisID: 'y' },
                { label: 'Radiación Solar (W/m²)', data: trazabilidadDataGlobal.diario.map(d => d.radiacionMean || 0), type: 'line', borderColor: '#ff5500', backgroundColor: 'rgba(154, 154, 154, 0.05)', fill: true, tension: 0.3, pointRadius: 1, borderWidth: 2, order: 1, yAxisID: 'y1' }
            ] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#000000', font: { size: 10 }, usePointStyle: true } }, tooltip: { callbacks: { label: function(context) { const unidad = context.dataset.label.includes('Precipitación') ? ' mm' : ' W/m²'; return `${context.dataset.label}: ${formatNumber(context.parsed.y)}${unidad}`; } } } }, scales: { x: { grid: { color: 'rgba(255, 255, 255, 0.08)' }, ticks: { color: '#000000', font: { size: 9 } } }, y: { position: 'left', grid: { color: 'rgba(251, 251, 251, 0.08)' }, ticks: { color: '#000000', font: { size: 9 } }, title: { display: true, text: 'Precipitación (mm)', color: '#010202', font: { size: 10 } }, beginAtZero: true }, y1: { position: 'right', grid: { display: false }, ticks: { color: '#000000', font: { size: 9 } }, title: { display: true, text: 'Radiación (W/m²)', color: '#010101', font: { size: 10 } }, beginAtZero: true } } }
        },
        trazabilidadNightChart: {
            type: 'line',
            data: { labels, datasets: [
                { label: 'Temperatura Nocturna (20:00-06:00)', data: trazabilidadDataGlobal.diario.map(d => d.tempNocturna || d.tempMean), borderColor: '#151516', backgroundColor: 'rgba(127, 127, 127, 0.15)', fill: true, tension: 0.3, pointRadius: 1.2, borderWidth: 1 },
                { label: 'Temperatura Promedio Diario', data: trazabilidadDataGlobal.diario.map(d => d.tempMean), borderColor: '#ff8800', backgroundColor: 'transparent', fill: false, tension: 0.3, pointRadius: 1.2, borderWidth: 1, borderDash: [1, 1] }
            ] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#303131', font: { size: 10 }, usePointStyle: true } } }, scales: { x: { grid: { color: 'rgba(250, 251, 252, 0.08)' }, ticks: { color: '#303131', font: { size: 9 } } }, y: { grid: { color: 'rgba(254, 255, 255, 0.08)' }, ticks: { color: '#303131', font: { size: 9 } }, title: { display: true, text: 'Temperatura (°C)', color: '#303131', font: { size: 10 } } } } }
        },
        trazabilidadVpdChart: {
            type: 'line',
            data: { labels: trazabilidadDataGlobal.horarios ? trazabilidadDataGlobal.horarios.filter(d => { const h = d.timestamp.getHours(); return h >= 6 && h < 18; }).map(d => formatDate(d.timestamp)) : labels, datasets: [
                { label: 'Déficit de Presión de Vapor (kPa)', data: trazabilidadDataGlobal.horarios ? trazabilidadDataGlobal.horarios.filter(d => { const h = d.timestamp.getHours(); return h >= 6 && h < 18; }).map(d => calcularVPD(d.temperatura, d.humedad)) : trazabilidadDataGlobal.diario.map(d => calcularVPD(d.tempMean, d.humedadMean)), borderColor: '#222222', backgroundColor: 'rgba(88, 83, 79, 0.03)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 0.7 }
            ] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#303131', font: { size: 9 }, usePointStyle: true, boxWidth: 12 } } }, scales: { x: { grid: { color: 'rgba(254, 254, 254, 0.08)' }, ticks: { color: '#303131', font: { size: 8 }, autoSkip: true, maxTicksLimit: 15 } }, y: { grid: { color: 'rgba(255, 255, 255, 0.08)' }, ticks: { color: '#303131', font: { size: 9 } }, title: { display: true, text: 'VPD (kPa)', color: '#303131', font: { size: 10 } }, beginAtZero: true } } }
        },
        trazabilidadHoras90Chart: {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Horas con HR > 90%', data: trazabilidadDataGlobal.horasSobre90 || trazabilidadDataGlobal.diario.map(d => d.humedadMean > 90 ? 1 : 0), backgroundColor: 'rgba(14, 61, 91, 0.6)', borderColor: '#ffffff', borderWidth: 1, borderRadius: 1 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#303131', font: { size: 10 }, usePointStyle: true } } }, scales: { x: { grid: { color: 'rgba(255, 255, 255, 0.08)' }, ticks: { color: '#303131', font: { size: 9 } } }, y: { grid: { color: 'rgba(254, 255, 255, 0.08)' }, ticks: { color: '#303131', font: { size: 9 } }, title: { display: true, text: 'Horas', color: '#303131', font: { size: 10 } }, beginAtZero: true } } }
        }
    };

    const exportChartConfig = (config) => {
        if (typeof Chart === 'undefined') return '';

        const host = document.createElement('div');
        host.style.position = 'absolute';
        host.style.left = '-99999px';
        host.style.top = '0';
        host.style.width = '900px';
        host.style.height = '320px';
        host.style.opacity = '0';
        host.style.pointerEvents = 'none';

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 900;
        tempCanvas.height = 320;
        host.appendChild(tempCanvas);
        document.body.appendChild(host);

        try {
            const snapshotChart = new Chart(tempCanvas, {
                ...config,
                options: {
                    ...(config.options || {}),
                    responsive: false,
                    animation: false,
                    maintainAspectRatio: false
                }
            });
            snapshotChart.update();
            const dataUrl = snapshotChart.toBase64Image('image/png');
            snapshotChart.destroy();
            return dataUrl && dataUrl !== 'data:,' ? dataUrl : '';
        } catch (error) {
            console.warn('No se pudo generar la imagen de una gráfica de trazabilidad:', error);
            return '';
        } finally {
            host.remove();
        }
    };

    const chartMarkup = Object.keys(chartDefinitions).slice(1).map(id => {
        const chart = chartMap[id];
        let dataUrl = '';
        try {
            if (chart && chart.canvas) {
                const canvas = chart.canvas;
                if (!canvas.width || !canvas.height) {
                    canvas.width = 900;
                    canvas.height = 320;
                    if (typeof chart.resize === 'function') chart.resize();
                    if (typeof chart.update === 'function') chart.update();
                }
                dataUrl = typeof chart.toBase64Image === 'function' ? chart.toBase64Image('image/png') : canvas.toDataURL('image/png');
            }

            if (!dataUrl || dataUrl === 'data:,') {
                dataUrl = exportChartConfig(chartDefinitions[id]);
            }

            if (!dataUrl || dataUrl === 'data:,') return '';
            const chartName = getGraficaLabelById(id);
            const defaultPrompt = `Analiza la ${chartName} desde el punto de vista agronómico y explica qué sugiere para la producción.`;
            return `
                <div class="ficha-plot-card">
                    <img src="${dataUrl}" alt="Gráfica de trazabilidad ${id}" />
                    <div class="ficha-plot-tools">
                        <textarea class="ficha-grafica-prompt" data-chart-id="${id}" rows="3">${defaultPrompt}</textarea>
                        <button class="ficha-grafica-btn" data-chart-id="${id}" type="button">Analizar gráfica</button>
                    </div>
                    <div class="ficha-grafica-resultado" data-chart-id="${id}"><strong>Interpretación:</strong><br>Presiona “Analizar gráfica” para consultar la lectura agronómica de esta visual.</div>
                </div>
            `;
        } catch (error) {
            console.warn(`No se pudo capturar la gráfica ${id}:`, error);
            return '';
        }
    }).join('');

    const tablaHtml = tablaEtapas.length > 0 ? `
        <table>
            <thead>
                <tr>
                    <th>Etapa</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Duración</th>
                    <th>Desarrollo</th>
                </tr>
            </thead>
            <tbody>
                ${tablaEtapas.map(fila => `
                    <tr>
                        <td>${fila.etapa}</td>
                        <td>${fila.inicio}</td>
                        <td>${fila.fin}</td>
                        <td>${fila.duracion}</td>
                        <td>${fila.desarrollo}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    ` : '<p>No se configuraron etapas para esta campaña.</p>';

    const html = `
        <style>
            .ficha-tecnica-document { font-family: Arial, sans-serif; color: #1f2a1f; background: #fff; border-radius: 16px; border: 1px solid #dfeee1; padding: 22px; box-shadow: 0 6px 18px rgba(12, 36, 24, 0.08); }
            .ficha-header { display: flex; align-items: center; gap: 16px; background: linear-gradient(135deg, #184d2d, #113b28); color: #fff; padding: 16px 20px; border-radius: 14px; }
            .ficha-logo-wrap img { width: 72px; height: 72px; object-fit: contain; background: rgba(255,255,255,0.08); border-radius: 12px; padding: 6px; }
            .ficha-header-copy h1 { margin: 0 0 6px; font-size: 1.8rem; }
            .ficha-header-copy p { margin: 0; opacity: 0.9; }
            .ficha-summary { margin-top: 18px; }
            .ficha-summary table { width: 100%; border-collapse: collapse; }
            .ficha-summary th, .ficha-summary td { border: 1px solid #dfeee1; padding: 10px 12px; text-align: left; }
            .ficha-summary th { background: #edf6ee; }
            .ficha-panel { margin-top: 18px; border: 1px solid #dfeee1; border-radius: 12px; padding: 18px; }
            .ficha-panel h3 { margin: 0 0 12px; color: #184d2d; }
            .ficha-panel table { width: 100%; border-collapse: collapse; }
            .ficha-panel th, .ficha-panel td { border: 1px solid #dfeee1; padding: 8px 10px; text-align: left; }
            .ficha-panel th { background: #f1f7f1; }
            .ficha-interpretacion { line-height: 1.7; }
            .ficha-chart-grid { display: grid; grid-template-columns: repeat(2, minmax(260px, 1fr)); gap: 18px; margin-top: 10px; }
            .ficha-plot-card { background: #fafcfb; border: 1px solid #dfeee1; border-radius: 12px; padding: 10px; }
            .ficha-plot-card img { display: block; width: 100%; height: auto; border-radius: 10px; }
            .ficha-plot-tools { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
            .ficha-grafica-prompt { width: 100%; border: 1px solid #dfeee1; border-radius: 10px; padding: 10px 12px; resize: vertical; font-family: Arial, sans-serif; font-size: 0.9rem; min-height: 74px; }
            .ficha-grafica-btn { align-self: flex-start; background: #184d2d; color: #fff; border: none; border-radius: 8px; padding: 9px 12px; cursor: pointer; font-weight: 600; }
            .ficha-grafica-resultado { margin-top: 12px; padding: 10px 12px; border-left: 4px solid #2f8f5b; background: #f3faf5; border-radius: 8px; line-height: 1.6; color: #234c39; }
            .ficha-footer { display: flex; align-items: center; gap: 10px; margin-top: 18px; padding-top: 12px; border-top: 1px solid #dfeee1; font-size: 0.8rem; color: #536b5a; }
            .ficha-footer img { width: 44px; height: 44px; }
            @media (max-width: 860px) { .ficha-chart-grid { grid-template-columns: 1fr; } .ficha-header { flex-direction: column; align-items: flex-start; } }
        </style>

        <div class="ficha-tecnica-document" data-lote="${loteId}" data-estacion="${nombreEstacion}">
            <div class="ficha-header">
                <div class="ficha-logo-wrap"><img src="logos/logo1.png" alt="Logo TRAZAR" /></div>
                <div class="ficha-header-copy">
                    <h1>FICHA TÉCNICA AGROCLIMÁTICA – LOTE DE CAFÉ</h1>
                    <p>${loteId} · ${variedad} · ${formatDateOnly(fechaInicio)} → ${formatDateOnly(fechaFin)}</p>
                </div>
            </div>

            <div class="ficha-summary">
                <table>
                    <tr><th>Estación</th><td>${nombreEstacion}</td><th>Altitud</th><td>${altitud} msnm</td></tr>
                    <tr><th>Coordenadas</th><td>Lat ${lat}, Lon ${lon}</td><th>Variedad</th><td>${variedad}</td></tr>
                    <tr><th>Periodo</th><td>${formatDateOnly(fechaInicio)} → ${formatDateOnly(fechaFin)}</td><th>Fecha de emisión</th><td>${new Date(fechaEmision).toLocaleString('es-PE')}</td></tr>
                </table>
            </div>

            <div class="ficha-panel">
                <h3>Cuadro de etapas fenológicas</h3>
                ${tablaHtml}
            </div>

            <div class="ficha-panel" style="display:none;">
                <h3>Diagnóstico técnico de trazabilidad ambiental</h3>
                <div class="ficha-interpretacion">${obtenerInterpretacionEspecialistaTrazabilidad()}</div>
            </div>

            <div class="ficha-panel">
                <h3>Gráficas de trazabilidad</h3>
                <div class="ficha-chart-grid">${chartMarkup || '<p>No se pudieron capturar las gráficas actuales de trazabilidad.</p>'}</div>
            </div>

            <div class="ficha-panel">
                <h3>Interpretación integral del lote</h3>
                <div class="ficha-interpretacion">
                    El lote evidenció un comportamiento climático coherente con la etapa ${etapaActual.label || 'productiva'} durante el período analizado. La temperatura media ${formatNumber(contexto.tempMean, 1)}°C, la humedad relativa media ${formatNumber(contexto.humedadMean, 0)}% y el VPD promedio ${formatNumber(contexto.vpdProm, 2)} kPa sostienen condiciones favorables para una producción uniforme, una maduración estable y una trazabilidad ambiental sólida. La etapa ${etapaActual.label || 'actual'} requiere vigilancia activa sobre humedad elevada y riesgo sanitario, especialmente en ciclos con más de ${contexto.horasRiesgo} horas sobre 90% de humedad. La recomendación técnica es mantener control de ventilación, VPD y saneamiento para preservar la consistencia sensorial y la calidad final del lote.
                </div>
            </div>

            <div class="ficha-footer">
                <img src="logos/logo1.png" alt="Logo TRAZAR" />
                <span>TRAZAR · Sistema de Monitoreo Agrícola</span>
            </div>
        </div>
    `;

    return { html, metadata: { lote_id: loteId, estacion: nombreEstacion, generado_en: fechaEmision, version_prompt: '1.0.0' } };
}

function getGraficaLabelById(chartId) {
    const labels = {
        trazabilidadMainChart: 'Evolución de indicadores',
        trazabilidadTempChart: 'Temperatura diaria',
        trazabilidadHumChart: 'Humedad diaria',
        trazabilidadPrecipRadChart: 'Precipitación y radiación',
        trazabilidadNightChart: 'Temperatura nocturna',
        trazabilidadVpdChart: 'VPD',
        trazabilidadHoras90Chart: 'Horas con humedad > 90%'
    };
    return labels[chartId] || 'gráfica';
}

function generarInterpretacionGraficaLocal(chartId, promptTexto = '') {
    const contexto = obtenerContextoInterpretacionTrazabilidad();
    if (!contexto) {
        return '<em>No hay datos cargados para interpretar esta gráfica.</em>';
    }

    const basePrompt = (promptTexto || '').trim();
    const nombreGrafica = getGraficaLabelById(chartId);
    const tempMean = formatNumber(contexto.tempMean, 1);
    const humMean = formatNumber(contexto.humedadMean, 0);
    const vpdProm = formatNumber(contexto.vpdProm, 2);
    const precipTotal = formatNumber(contexto.precipTotal, 1);
    const riesgoHoras = contexto.horasRiesgo;

    const mensajes = {
        trazabilidadMainChart: `La ${nombreGrafica} muestra una sincronía general entre temperatura, humedad y acumulación de GDD. La temperatura media fue ${tempMean}°C y la humedad promedio ${humMean}%, con un patrón productivo compatible con la etapa ${contexto.etapaActual}. El comportamiento sugiere estabilidad fisiológica del lote, con tendencia favorable para desarrollo y maduración uniforme.`,
        trazabilidadTempChart: `En ${nombreGrafica}, la temperatura diaria presenta un rango útil para café con promedio de ${tempMean}°C, sin extremos severos que comprometan la calidad. Las fluctuaciones diarias favorecen la respiración y la maduración, pero se recomienda vigilar picos nocturnos y días calurosos para evitar estrés térmico.`,
        trazabilidadHumChart: `La ${nombreGrafica} indica que la humedad relativa se mantiene en un rango de funcionamiento aceptable para café, con promedio de ${humMean}% y períodos de humedad elevada que requieren especial cuidado. Cuando la humedad supera 90%, aumenta el riesgo sanitario y la pérdida de uniformidad en la calidad.`,
        trazabilidadPrecipRadChart: `La relación entre precipitación y radiación sugiere que el lote presenta un balance climatológico moderado. La precipitación acumulada fue ${precipTotal} mm y la radiación promedio se mantiene en valores que permiten desarrollo vegetativo y maduración sin estrés excesivo.`,
        trazabilidadNightChart: `La ${nombreGrafica} evidencia que la temperatura nocturna permanece moderada, factor clave para la recuperación fisiológica del cultivo y la calidad del grano. Si las noches son demasiado cálidas, la respiración aumenta y el balance del desarrollo puede alterarse.`,
        trazabilidadVpdChart: `El ${nombreGrafica} muestra un déficit de presión de vapor medio de ${vpdProm} kPa, lo que indica una demanda atmosférica moderada. Este rango favorece la transpiración controlada y una maduración más estable, siempre que no se presenten episodios de VPD alto o muy bajo.`,
        trazabilidadHoras90Chart: `La ${nombreGrafica} muestra ${riesgoHoras} horas por encima de 90% de humedad relativa, un nivel que incrementa el riesgo fitosanitario y reduce la eficiencia de la evapotranspiración. Es importante controlar ventilación, cobertura y manejo sanitario si persisten estos eventos.`
    };

    return mensajes[chartId] || `La ${nombreGrafica} refleja un patrón climático consistente con la etapa ${contexto.etapaActual}. Se recomienda sostener medidas de control de humedad y temperatura para mantener la calidad y la productividad del lote.`;
}

function renderFichaAgronomicaPreviewDesdeHtml(htmlString) {
    const preview = document.getElementById('fichaAgronomicaPreview');
    if (!preview || !htmlString) return;

    preview.classList.remove('empty');
    preview.innerHTML = htmlString || 'No se pudo cargar la ficha técnica.';

    preview.querySelectorAll('.ficha-grafica-btn').forEach(button => {
        button.addEventListener('click', () => {
            const chartId = button.dataset.chartId;
            const promptInput = preview.querySelector(`textarea[data-chart-id="${chartId}"]`);
            const resultBox = preview.querySelector(`.ficha-grafica-resultado[data-chart-id="${chartId}"]`);
            if (!resultBox) return;

            const textoPrompt = (promptInput?.value || '').trim();
            const resultado = generarInterpretacionGraficaLocal(chartId, textoPrompt);
            resultBox.innerHTML = `<strong>Interpretación:</strong><br>${resultado}`;
        });
    });
}

function inicializarEventosFichaTecnica() {
    const btnFicha = document.getElementById('trazabilidadFichaPrevisualizarBtn');
    if (btnFicha) {
        btnFicha.addEventListener('click', () => generarFichaTecnicaTrazabilidad('trazabilidadFichaPreview'));
    }

    const btnFichaAgronomica = document.getElementById('fichaAgronomicaGenerarBtn');
    if (btnFichaAgronomica) {
        btnFichaAgronomica.addEventListener('click', () => {
            const resultado = generarFichaTecnicaAutomatica();
            if (!resultado.html) {
                const preview = document.getElementById('fichaAgronomicaPreview');
                if (preview) {
                    preview.classList.add('empty');
                    preview.textContent = 'Primero selecciona una estación y carga la trazabilidad para generar la ficha técnica.';
                }
                return;
            }
            renderFichaAgronomicaPreviewDesdeHtml(resultado.html);
            window.__fichaTecnicaAutomatica = resultado;
        });
    }

    const btnFichaAgronomicaPdf = document.getElementById('fichaAgronomicaPdfBtn');
    if (btnFichaAgronomicaPdf) {
        btnFichaAgronomicaPdf.addEventListener('click', exportarFichaAgronomicaPdf);
    }
}

function obtenerContextoInterpretacionTrazabilidad() {
    if (!trazabilidadDataGlobal || !trazabilidadDataGlobal.diario || trazabilidadDataGlobal.diario.length === 0) {
        return null;
    }

    const { diario, nombre, cultivo, fechaInicio, fechaFin, estacion } = trazabilidadDataGlobal;
    const tempMean = average(diario.map(d => d.tempMean));
    const tempMax = Math.max(...diario.map(d => d.tempMax));
    const tempMin = Math.min(...diario.map(d => d.tempMin));
    const humedadMean = average(diario.map(d => d.humedadMean));
    const humedadMax = Math.max(...diario.map(d => d.humedadMax));
    const humedadMin = Math.min(...diario.map(d => d.humedadMin));
    const precipTotal = diario.reduce((sum, d) => sum + Number(d.precipitacion || 0), 0);
    const radiacionMean = average(diario.map(d => d.radiacionMean || 0));
    const vpdProm = average(diario.map(d => (d.tempMean && d.humedadMean) ? calcularVPD(d.tempMean, d.humedadMean) : 0));
    const horasRiesgo = diario.reduce((sum, d) => sum + (d.humedadMean > 90 ? 1 : 0), 0);
    const gddTotal = diario[diario.length - 1]?.gddAcumulado || 0;
    const etapaActual = getEtapaForDate(new Date(), getEtapasParaGrafica(diario));

    return {
        nombre,
        cultivo: cultivo || 'café',
        estacion: estacion?.nombre || nombre,
        periodo: `${formatDateOnly(fechaInicio)} - ${formatDateOnly(fechaFin)}`,
        tempMean,
        tempMax,
        tempMin,
        humedadMean,
        humedadMax,
        humedadMin,
        precipTotal,
        radiacionMean,
        vpdProm,
        horasRiesgo,
        gddTotal,
        etapaActual: etapaActual.label || 'Etapa de desarrollo',
        dias: diario.length
    };
}

function generarInterpretacionLocalTrazabilidad() {
    const panel = document.getElementById('trazabilidadInterpretacionResultado');
    if (!panel) return;

    const contexto = obtenerContextoInterpretacionTrazabilidad();
    if (!contexto) {
        panel.classList.add('empty');
        panel.textContent = 'Selecciona una estación y carga los datos para generar una interpretación inteligente del comportamiento ambiental.';
        return;
    }

    panel.classList.remove('empty');
    panel.innerHTML = obtenerInterpretacionEspecialistaTrazabilidad();
}

async function analizarTrazabilidadConGemini() {
    const panel = document.getElementById('trazabilidadInterpretacionResultado');
    if (!panel) return;

    const contexto = obtenerContextoInterpretacionTrazabilidad();
    if (!contexto) {
        panel.classList.add('empty');
        panel.textContent = 'Primero selecciona una estación y carga sus datos para analizar la trazabilidad.';
        return;
    }

    const apiKeyInput = document.getElementById('geminiApiKey');
    const apiKey = (apiKeyInput?.value || '').trim() || localStorage.getItem('geminiApiKey') || '';

    if (!apiKey) {
        panel.classList.remove('empty');
        panel.innerHTML = `
            <strong>Gemini no configurado.</strong><br>
            Ingresa tu clave de API en el campo <strong>Gemini API Key</strong> y vuelve a presionar <strong>Analizar</strong>.<br>
            Mientras tanto, esta es la interpretación local de la producción:<br><br>
            ${generarInterpretacionLocalComoHtml(contexto)}
        `;
        return;
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const prompt = `Eres un agrónomo experto en café y trazabilidad de producción. Analiza estas métricas de producción para la estación ${contexto.nombre} del cultivo ${contexto.cultivo}. Considera estas gráficas: temperatura, humedad, precipitación, radiación, VPD, temperatura nocturna, horas con humedad > 90% y etapas fenológicas. Responde en español y enfócate en la particularidad productiva del cultivo.

Métricas:
- Periodo: ${contexto.periodo}
- Temperatura promedio: ${formatNumber(contexto.tempMean, 1)} °C
- Temperatura máxima: ${formatNumber(contexto.tempMax, 1)} °C
- Temperatura mínima: ${formatNumber(contexto.tempMin, 1)} °C
- Humedad promedio: ${formatNumber(contexto.humedadMean, 0)}%
- Humedad máxima: ${formatNumber(contexto.humedadMax, 0)}%
- Humedad mínima: ${formatNumber(contexto.humedadMin, 0)}%
- Precipitación total: ${formatNumber(contexto.precipTotal, 1)} mm
- Radiación promedio: ${formatNumber(contexto.radiacionMean, 0)} W/m²
- VPD promedio: ${formatNumber(contexto.vpdProm, 2)} kPa
- Horas con humedad > 90%: ${contexto.horasRiesgo}
- GDD acumulado: ${formatNumber(contexto.gddTotal, 1)}
- Etapa actual: ${contexto.etapaActual}

Necesito:
1. Síntesis agronómica clara de lo que muestran las gráficas.
2. Particularidad de producción del cultivo observada.
3. Riesgos fisiológicos o sanitarios presentes.
4. Recomendación técnica accionable con enfoque agronómico.
5. Respuesta breve pero útil, en 4-6 líneas máximo, con formato HTML simple para sitio web.

No menciones que eres una IA ni que estás usando datos simulados. Hazlo como un especialista agrónomo.`;

    panel.classList.remove('empty');
    panel.innerHTML = '<strong>Analizando trazabilidad con Gemini...</strong>';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();
        if (!response.ok || !data.candidates?.[0]?.content?.parts) {
            throw new Error(data?.error?.message || 'No se pudo generar la interpretación');
        }

        const texto = data.candidates[0].content.parts
            .map(part => part.text || '')
            .join('')
            .replace(/\n+/g, '<br>')
            .trim();

        localStorage.setItem('geminiApiKey', apiKey);
        panel.innerHTML = texto || generarInterpretacionLocalComoHtml(contexto);
    } catch (error) {
        console.error('Error al consultar Gemini:', error);
        panel.innerHTML = `<strong>Fallo del análisis con Gemini.</strong><br>Se usará la interpretación local disponible:<br><br>${generarInterpretacionLocalComoHtml(contexto)}`;
    }
}

function generarInterpretacionLocalComoHtml(contexto) {
    const tempMean = formatNumber(contexto.tempMean, 1);
    const tempMax = formatNumber(contexto.tempMax, 1);
    const tempMin = formatNumber(contexto.tempMin, 1);
    const humedadMean = formatNumber(contexto.humedadMean, 0);
    const preci = formatNumber(contexto.precipTotal, 1);
    const gdd = formatNumber(contexto.gddTotal, 1);
    return `
        <strong>Estación:</strong> ${contexto.nombre}<br>
        <strong>Periodo:</strong> ${contexto.periodo}<br>
        <strong>Conclusión:</strong> la producción presenta un comportamiento ${contexto.tempMean > 25 ? 'con alta demanda térmica' : 'estable y dentro del rango agronómico'}; la temperatura promedio fue ${tempMean}°C, con máximos de ${tempMax}°C y mínimos de ${tempMin}°C. La humedad promedio fue ${humedadMean}% y la precipitación acumulada fue ${preci} mm. El desempeño del cultivo se ubica en una etapa ${contexto.etapaActual}, con GDD acumulado de ${gdd} y con vigilancia recomendada por riesgo de humedad elevada y estrés térmico episódico.
    `;
}

function generarInterpretacionTrazabilidad() {
    const panel = document.getElementById('trazabilidadInterpretacionResultado');
    if (!panel) return;

    const contexto = obtenerContextoInterpretacionTrazabilidad();
    if (!contexto) {
        panel.classList.add('empty');
        panel.textContent = 'Selecciona una estación y carga los datos para generar una interpretación inteligente del comportamiento ambiental.';
        return;
    }

    const apiKeyInput = document.getElementById('geminiApiKey');
    const apiKey = (apiKeyInput?.value || '').trim() || localStorage.getItem('geminiApiKey') || '';
    if (apiKey) {
        analizarTrazabilidadConGemini();
        return;
    }

    generarInterpretacionLocalTrazabilidad();
}

function renderTrazabilidadTabla(diario, etapasInfo) {
    const tbody = document.getElementById('trazabilidadTableBody');
    if (!tbody) return;
    if (!diario || diario.length === 0) {
        tbody.innerHTML = '<tr><td colspan="12" class="text-center">No hay datos disponibles</td></tr>';
        return;
    }
    const mostrar = diario.slice().reverse();
    tbody.innerHTML = mostrar.map(d => {
        const etapa = getEtapaForDate(d.fecha, etapasInfo);
        const etapaClass = etapa.class || 'pre-floral';
        const etapaLabel = etapa.label || '🌱 Pre-Floral';
        return `
            <tr>
                <td><strong>${formatDateOnly(d.fecha)}</strong></td>
                <td>${formatNumber(d.tempMean)}</td>
                <td style="color: #e74c3c; font-weight: 600;">${formatNumber(d.tempMax)}</td>
                <td style="color: #2980b9; font-weight: 600;">${formatNumber(d.tempMin)}</td>
                <td>${formatNumber(d.humedadMean)}</td>
                <td style="color: #2980b9; font-weight: 600;">${formatNumber(d.humedadMean)}</td>
                <td style="color: #8e44ad; font-weight: 600;">${formatNumber(d.humedadMean)}</td>
                <td style="color: #6c5ce7; font-weight: 600;">${formatNumber(d.tempNocturna || d.tempMean)}</td>
                <td style="color: #27ae60; font-weight: 600;">${formatNumber(d.gddAcumulado || 0, 0)}</td>
                <td>${formatNumber(d.precipitacion)}</td>
                <td>${formatNumber(d.radiacionMean || 0, 0)}</td>
                <td><span class="etapa-tag ${etapaClass}">${etapaLabel}</span></td>
            </tr>
        `;
    }).join('');
}

function renderTrazabilidadGraficas(diario, horarios, horasSobre90, estacion, etapasInfo) {
    if (!diario || diario.length === 0) return;
    const labels = diario.map(d => formatDateOnly(d.fecha));
    const color = estacion?.color || '#27ae60';
    
    Object.keys(trazabilidadChartInstances).forEach(key => {
        if (trazabilidadChartInstances[key]) {
            try { trazabilidadChartInstances[key].destroy(); } catch (e) {}
        }
    });
    trazabilidadChartInstances = {};

    // Registrar plugin de anotación
    if (typeof Chart !== 'undefined' && Chart.registry) {
        if (!Chart.registry.plugins.get('annotation')) {
            try { Chart.register(ChartAnnotation); } catch (e) { console.warn('Plugin de anotación no disponible'); }
        }
    }

    // 1. Gráfica principal
    const mainChart = document.getElementById('trazabilidadMainChart');
    if (mainChart) {
        const config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Temperatura Promedio (°C)', data: diario.map(d => d.tempMean), borderColor: '#e74c3c', backgroundColor: 'rgba(231, 76, 60, 0.05)', fill: true, tension: 0.3, pointRadius: 1, borderWidth: 2, yAxisID: 'y' },
                    { label: 'Humedad Promedio (%)', data: diario.map(d => d.humedadMean), borderColor: '#3498db', backgroundColor: 'rgba(52, 152, 219, 0.05)', fill: true, tension: 0.3, pointRadius: 1, borderWidth: 2, yAxisID: 'y1' },
                    { label: 'GDD Acumulado', data: diario.map(d => d.gddAcumulado || 0), borderColor: '#27ae60', backgroundColor: 'rgba(46, 204, 113, 0.05)', fill: true, tension: 0.3, pointRadius: 1, borderWidth: 2, borderDash: [3, 3], yAxisID: 'y2' }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
                plugins: { legend: { labels: { color: '#b0bec5', font: { size: 10 }, usePointStyle: true } } },
                scales: {
                    x: { grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#78909c', font: { size: 9 }, maxTicksLimit: 30 } },
                    y: { position: 'left', grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'Temperatura (°C)', color: '#78909c', font: { size: 10 } } },
                    y1: { position: 'right', grid: { display: false }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'Humedad (%)', color: '#78909c', font: { size: 10 } }, min: 20, max: 100 },
                    y2: { position: 'right', grid: { display: false }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'GDD', color: '#78909c', font: { size: 10 } }, display: false }
                }
            }
        };
        trazabilidadChartInstances.main = new Chart(mainChart, config);
        addVerticalLinesToChart(trazabilidadChartInstances.main, etapasInfo);
    }

    // 2. Temperatura
    const tempChart = document.getElementById('trazabilidadTempChart');
    if (tempChart) {
        const config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Máxima Diaria', data: diario.map(d => d.tempMax), borderColor: '#b31504', backgroundColor: 'rgba(251, 250, 250, 0.1)', fill: true, tension: 0.3, pointRadius: 1.2, borderWidth: 1 },
                    { label: 'Promedio Diario', data: diario.map(d => d.tempMean), borderColor: '#fe1e00', backgroundColor: 'transparent', fill: false, tension: 0.3, pointRadius: 1.2, borderWidth: 1, borderDash: [3, 3] },
                    { label: 'Mínima Diaria', data: diario.map(d => d.tempMin), borderColor: '#ff9e03', backgroundColor: 'rgba(252, 252, 252, 0.1)', fill: true, tension: 0.3, pointRadius: 1.2, borderWidth: 1 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#303131', font: { size: 10 }, usePointStyle: true } } },
                scales: {
                    x: { grid: { color: 'rgba(255, 255, 255, 0.08)' }, ticks: { color: '#303131', font: { size: 9 } } },
                    y: { grid: { color: 'rgba(250, 250, 251, 0.08)' }, ticks: { color: '#303131', font: { size: 9 } }, title: { display: true, text: 'Temperatura (°C)', color: '#303131', font: { size: 10 } } }
                }
            }
        };
        trazabilidadChartInstances.temp = new Chart(tempChart, config);
        addVerticalLinesToChart(trazabilidadChartInstances.temp, etapasInfo);
    }

    // 3. Humedad
    const humChart = document.getElementById('trazabilidadHumChart');
    if (humChart) {
        const config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Máxima Diaria', data: diario.map(d => d.humedadMax), borderColor: '#0669ab', backgroundColor: 'rgba(250, 250, 251, 0.1)', fill: true, tension: 0.3, pointRadius: 1.2, borderWidth: 1 },
                    { label: 'Promedio Diario', data: diario.map(d => d.humedadMean), borderColor: '#1c9cb3', backgroundColor: 'transparent', fill: false, tension: 0.3, pointRadius: 1.2, borderWidth: 1, borderDash: [1, 1] },
                    { label: 'Mínima Diaria', data: diario.map(d => d.humedadMin), borderColor: '#77c4c4', backgroundColor: 'rgba(253, 253, 253, 0.1)', fill: true, tension: 0.3, pointRadius: 1.2, borderWidth: 1 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#303131', font: { size: 10 }, usePointStyle: true } } },
                scales: {
                    x: { grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#303131', font: { size: 9 } } },
                    y: { grid: { color: 'rgba(42,58,78,0.08)' }, ticks: { color: '#303131', font: { size: 9 } }, min: 20, max: 100, title: { display: true, text: 'Humedad (%)', color: '#303131', font: { size: 10 } } }
                }
            }
        };
        trazabilidadChartInstances.hum = new Chart(humChart, config);
        addVerticalLinesToChart(trazabilidadChartInstances.hum, etapasInfo);
    }

    // 4. Temperatura Nocturna
    const nightChart = document.getElementById('trazabilidadNightChart');
    if (nightChart) {
        const config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Temperatura Nocturna (20:00-06:00)', data: diario.map(d => d.tempNocturna || d.tempMean), borderColor: '#151516', backgroundColor: 'rgba(127, 127, 127, 0.15)', fill: true, tension: 0.3, pointRadius: 1.2, borderWidth: 1 },
                    { label: 'Temperatura Promedio Diario', data: diario.map(d => d.tempMean), borderColor: '#ff8800', backgroundColor: 'transparent', fill: false, tension: 0.3, pointRadius: 1.2, borderWidth: 1, borderDash: [1, 1] }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#303131', font: { size: 10 }, usePointStyle: true } } },
                scales: {
                    x: { grid: { color: 'rgba(250, 251, 252, 0.08)' }, ticks: { color: '#303131', font: { size: 9 } } },
                    y: { grid: { color: 'rgba(254, 255, 255, 0.08)' }, ticks: { color: '#303131', font: { size: 9 } }, title: { display: true, text: 'Temperatura (°C)', color: '#303131', font: { size: 10 } } }
                }
            }
        };
        trazabilidadChartInstances.night = new Chart(nightChart, config);
        addVerticalLinesToChart(trazabilidadChartInstances.night, etapasInfo);
    }

    // 5. VPD
    const vpdChart = document.getElementById('trazabilidadVpdChart');
    if (vpdChart && horarios && horarios.length > 0) {
        const vpdData = horarios
            .filter(d => { const h = d.timestamp.getHours(); return h >= 6 && h < 18; })
            .map(d => ({ timestamp: d.timestamp, vpd: calcularVPD(d.temperatura, d.humedad) }));
        if (vpdData.length > 0) {
            const vpdLabels = vpdData.map(d => formatDate(d.timestamp));
            const vpdValues = vpdData.map(d => d.vpd);
            const vpdStageLines = etapasInfo
                .map(etapa => {
                    const stageDate = etapa.fecha;
                    let idx = vpdData.findIndex(d => d.timestamp.toDateString() === stageDate.toDateString());
                    if (idx === -1) {
                        idx = vpdData.findIndex(d => d.timestamp >= stageDate);
                    }
                    if (idx === -1) idx = vpdData.length - 1;
                    return { ...etapa, index: idx };
                })
                .filter(etapa => Number.isFinite(etapa.index) && etapa.index >= 0 && etapa.index < vpdValues.length);
            const umbrales = [
                { valor: 3, label: 'Muy alto', color: '#e74c3c' },
                { valor: 2.41, label: 'Alto', color: '#f39c12' },
                { valor: 1.3, label: 'Normal alto', color: '#f1c40f' },
                { valor: 0.7, label: 'Normal', color: '#2ecc71' },
                { valor: 0.37, label: 'Normal bajo', color: '#1abc9c' },
                { valor: 0.1, label: 'Bajo', color: '#3498db' }
            ];
            const config = {
                type: 'line',
                data: {
                    labels: vpdLabels,
                    datasets: [
                        { label: 'Déficit de Presión de Vapor (kPa)', data: vpdValues, borderColor: '#222222', backgroundColor: 'rgba(88, 83, 79, 0.03)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 0.7 },
                        ...umbrales.map(u => ({ type: 'line', label: `Umbral ${u.label}`, data: vpdValues.map(() => u.valor), borderColor: u.color, borderDash: [6, 6], pointRadius: 0, borderWidth: 1.2, fill: false, order: 1, tension: 0, tooltip: { enabled: false } }))
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: '#303131', font: { size: 9 }, usePointStyle: true, boxWidth: 12 } } },
                    scales: {
                        x: { grid: { color: 'rgba(254, 254, 254, 0.08)' }, ticks: { color: '#303131', font: { size: 8 }, autoSkip: true, maxTicksLimit: 15 } },
                        y: { grid: { color: 'rgba(255, 255, 255, 0.08)' }, ticks: { color: '#303131', font: { size: 9 } }, title: { display: true, text: 'VPD (kPa)', color: '#303131', font: { size: 10 } }, beginAtZero: true }
                    }
                }
            };
            trazabilidadChartInstances.vpd = new Chart(vpdChart, config);
            addVerticalLinesToChart(trazabilidadChartInstances.vpd, vpdStageLines);
        }
    }

    // 6. Horas con Humedad > 90%
    const horas90Chart = document.getElementById('trazabilidadHoras90Chart');
    if (horas90Chart && horasSobre90 && horasSobre90.length > 0) {
        const config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{ label: 'Horas con HR > 90%', data: horasSobre90, backgroundColor: 'rgba(14, 61, 91, 0.6)', borderColor: '#ffffff', borderWidth: 1, borderRadius: 1 }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#303131', font: { size: 10 }, usePointStyle: true } } },
                scales: {
                    x: { grid: { color: 'rgba(255, 255, 255, 0.08)' }, ticks: { color: '#303131', font: { size: 9 } } },
                    y: { grid: { color: 'rgba(254, 255, 255, 0.08)' }, ticks: { color: '#303131', font: { size: 9 } }, title: { display: true, text: 'Horas', color: '#303131', font: { size: 10 } }, beginAtZero: true }
                }
            }
        };
        trazabilidadChartInstances.horas90 = new Chart(horas90Chart, config);
        addVerticalLinesToChart(trazabilidadChartInstances.horas90, etapasInfo);
    }

    // 7. Precipitación y Radiación
    const precipRadChart = document.getElementById('trazabilidadPrecipRadChart');
    if (precipRadChart) {
        const config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Precipitación (mm)', data: diario.map(d => d.precipitacion), backgroundColor: 'rgba(0, 130, 153, 0.98)', borderColor: '#f9f9f9', borderWidth: 1, borderRadius: 4, order: 2, yAxisID: 'y' },
                    { label: 'Radiación Solar (W/m²)', data: diario.map(d => d.radiacionMean || 0), type: 'line', borderColor: '#ff5500', backgroundColor: 'rgba(154, 154, 154, 0.05)', fill: true, tension: 0.3, pointRadius: 1, borderWidth: 2, order: 1, yAxisID: 'y1' }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#000000', font: { size: 10 }, usePointStyle: true } },
                    tooltip: { callbacks: { label: function(context) { const unidad = context.dataset.label.includes('Precipitación') ? ' mm' : ' W/m²'; return `${context.dataset.label}: ${formatNumber(context.parsed.y)}${unidad}`; } } }
                },
                scales: {
                    x: { grid: { color: 'rgba(255, 255, 255, 0.08)' }, ticks: { color: '#000000', font: { size: 9 } } },
                    y: { position: 'left', grid: { color: 'rgba(251, 251, 251, 0.08)' }, ticks: { color: '#000000', font: { size: 9 } }, title: { display: true, text: 'Precipitación (mm)', color: '#010202', font: { size: 10 } }, beginAtZero: true },
                    y1: { position: 'right', grid: { display: false }, ticks: { color: '#000000', font: { size: 9 } }, title: { display: true, text: 'Radiación (W/m²)', color: '#010101', font: { size: 10 } }, beginAtZero: true }
                }
            }
        };
        trazabilidadChartInstances.precipRad = new Chart(precipRadChart, config);
        addVerticalLinesToChart(trazabilidadChartInstances.precipRad, etapasInfo);
    }

    configurarDescargasGraficasTrazabilidad();
}

function configurarDescargasGraficasTrazabilidad() {
    const nombres = {
        main: 'evolucion-indicadores',
        temp: 'temperatura-diaria',
        hum: 'humedad-diaria',
        night: 'temperatura-nocturna',
        vpd: 'vpd',
        horas90: 'horas-humedad-mayor-90',
        precipRad: 'precipitacion-radiacion'
    };
    Object.entries(nombres).forEach(([key, nombreGrafica]) => {
        const chart = trazabilidadChartInstances[key];
        if (!chart || !chart.canvas) return;

        const encabezado = chart.canvas.closest('.chart-header');
        if (!encabezado) return;

        let boton = encabezado.querySelector(`[data-download-chart="${key}"]`);
        if (!boton) {
            boton = document.createElement('button');
            boton.type = 'button';
            boton.className = 'btn-download-chart';
            boton.dataset.downloadChart = key;
            boton.innerHTML = '<i class="fas fa-download"></i><span>PNG</span>';
            boton.title = 'Descargar gráfica en PNG';
            boton.setAttribute('aria-label', 'Descargar gráfica en PNG');
            encabezado.appendChild(boton);
        }
        boton.onclick = () => {
            const chartActual = trazabilidadChartInstances[key];
            if (chartActual) descargarGraficaTrazabilidad(chartActual, nombreGrafica);
        };
    });
}

function descargarGraficaTrazabilidad(chart, nombreGrafica) {
    if (!chart || !chart.canvas) return;
    const nombreEstacion = trazabilidadDataGlobal?.nombre || 'estacion';
    const nombreArchivo = `${nombreEstacion}-${nombreGrafica}-${new Date().toISOString().split('T')[0]}`
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();
    const densidadExportacion = 3;
    const densidadOriginal = chart.options.devicePixelRatio;
    let imagen;

    try {
        chart.options.devicePixelRatio = densidadExportacion;
        chart.resize();
        chart.render();

        const lienzoExportacion = document.createElement('canvas');
        lienzoExportacion.width = chart.canvas.width;
        lienzoExportacion.height = chart.canvas.height;
        const contextoExportacion = lienzoExportacion.getContext('2d');
        contextoExportacion.fillStyle = '#ffffff';
        contextoExportacion.fillRect(0, 0, lienzoExportacion.width, lienzoExportacion.height);
        contextoExportacion.drawImage(chart.canvas, 0, 0);
        imagen = lienzoExportacion.toDataURL('image/png');
    } finally {
        chart.options.devicePixelRatio = densidadOriginal;
        chart.resize();
        chart.render();
    }

    if (!imagen || imagen === 'data:,') return;

    const enlace = document.createElement('a');
    enlace.style.display = 'none';
    enlace.href = imagen;
    enlace.download = `${nombreArchivo || 'grafica-trazabilidad'}.png`;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
}

function addVerticalLinesToChart(chart, etapasInfo, borderDash = [4, 4]) {
    if (!chart || !etapasInfo || etapasInfo.length === 0) return;
    if (!chart.options) return;
    if (!chart.data || !chart.data.labels) return;

    const filtered = etapasInfo
        .filter(etapa => Number.isFinite(etapa.index) && etapa.index >= 0 && etapa.index < chart.data.labels.length)
        .map(etapa => ({ ...etapa, borderDash }));

    chart._customStageLines = filtered;
    if (!chart.options.plugins) chart.options.plugins = {};
    chart.options.plugins.customVerticalStagePlugin = { stages: filtered };

    try {
        if (typeof chart.update === 'function') chart.update();
    } catch (e) {
        console.warn('Error al actualizar chart con líneas verticales:', e);
    }
}

function calcularVPD(temperatura, humedad) {
    const temp = Number(temperatura);
    const hr = Number(humedad);
    if (!Number.isFinite(temp) || !Number.isFinite(hr)) return 0;
    const humedadRelativa = Math.max(0, Math.min(100, hr));
    const pvs = 0.6107 * Math.pow(10, (7.5 * temp) / (237.3 + temp));
    const pva = pvs * (humedadRelativa / 100);
    return pvs - pva;
}

function generarReportePdfTrazabilidad() {
    if (!trazabilidadDataGlobal || !trazabilidadDataGlobal.diario || trazabilidadDataGlobal.diario.length === 0) {
        alert('Primero selecciona una estación y carga la trazabilidad para generar el reporte PDF.');
        return;
    }

    const contexto = obtenerContextoInterpretacionTrazabilidad();
    if (!contexto) {
        alert('No hay datos disponibles para generar la vista previa del reporte.');
        return;
    }

    const chartConfigs = [
        { key: 'temp', label: 'Temperatura: Promedio, Máx, Mín', description: 'Comparativa diaria' },
        { key: 'hum', label: 'Humedad: Promedio, Máx, Mín', description: 'Comparativa diaria' },
        { key: 'precipRad', label: 'Precipitación y Radiación Solar', description: 'mm · W/m²' },
        { key: 'night', label: 'Temperatura Nocturna vs Promedio', description: '20:00 - 06:00' },
        { key: 'vpd', label: 'Déficit de Presión de Vapor (VPD)', description: 'kPa' },
        { key: 'horas90', label: 'Horas con Humedad > 90%', description: 'Riesgo de enfermedades' }
    ];

    const obtenerImagenChart = (chartKey) => {
        const chart = trazabilidadChartInstances[chartKey];
        if (!chart || !chart.canvas) return '';
        const canvas = chart.canvas;
        if (!canvas.width || !canvas.height) {
            canvas.width = 900;
            canvas.height = 320;
            if (typeof chart.resize === 'function') chart.resize();
            if (typeof chart.update === 'function') chart.update();
        }
        try {
            return canvas.toDataURL('image/png');
        } catch (error) {
            console.warn(`No se pudo exportar la gráfica de trazabilidad ${chartKey}:`, error);
            return '';
        }
    };

    const chartCards = chartConfigs
        .map(({ key, label, description }) => {
            const dataUrl = obtenerImagenChart(key);
            return dataUrl
                ? `
                    <div class="report-card">
                        <h4>${label}</h4>
                        <p>${description}</p>
                        <img src="${dataUrl}" alt="${label}" />
                    </div>
                `
                : '';
        })
        .join('');

    const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <title>Reporte de Trazabilidad Ambiental</title>
            <style>
                :root {
                    --bg: #edf5ef;
                    --paper: #ffffff;
                    --line: #dcefe0;
                    --primary: #1d4d34;
                    --primary-deep: #113423;
                    --accent: #d7b26d;
                    --accent-soft: #f6ead1;
                    --muted: #5d6f67;
                    --text: #1e2a26;
                    --shadow: 0 18px 44px rgba(17, 52, 35, 0.12);
                }

                * { box-sizing: border-box; }

                body {
                    margin: 0;
                    font-family: Arial, Helvetica, sans-serif;
                    background: linear-gradient(180deg, #eef8f0 0%, #f7faf7 100%);
                    color: var(--text);
                    padding: 28px;
                }

                .report-page {
                    position: relative;
                    max-width: 1180px;
                    margin: 0 auto;
                    background: var(--paper);
                    border: 1px solid var(--line);
                    border-radius: 24px;
                    box-shadow: var(--shadow);
                    padding: 28px 28px 18px;
                    overflow: hidden;
                }

                .ornament {
                    position: absolute;
                    width: 120px;
                    height: 120px;
                    opacity: 0.12;
                    pointer-events: none;
                    filter: saturate(0.9);
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                }

                .ornament-1 { top: 22px; right: 34px; background-image: url('logos/elemento1.png'); }
                .ornament-2 { bottom: 28px; left: 30px; background-image: url('logos/elemento2.png'); }
                .ornament-3 { top: 120px; left: 26px; background-image: url('logos/elemento3.png'); }
                .ornament-4 { bottom: 52px; right: 40px; background-image: url('logos/elemento4.png'); }

                .report-header {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 18px;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-deep) 70%);
                    border-radius: 20px;
                    padding: 22px 24px;
                    margin-bottom: 20px;
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.18);
                    color: #fff;
                }

                .report-brand {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    z-index: 1;
                }

                .brand-badge {
                    width: 88px;
                    height: 88px;
                    border-radius: 18px;
                    background: rgba(255,255,255,0.10);
                    border: 1px solid rgba(255,255,255,0.2);
                    display: grid;
                    place-items: center;
                    backdrop-filter: blur(2px);
                }

                .brand-badge img,
                .brand-stack img,
                .report-footer-brand img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }

                .brand-badge img {
                    width: 62px;
                    height: 62px;
                    border-radius: 12px;
                }

                .report-header h1 {
                    margin: 0;
                    font-size: clamp(1.9rem, 2.2vw, 2.6rem);
                    letter-spacing: -0.04em;
                }

                .eyebrow {
                    display: inline-block;
                    font-size: 0.72rem;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    opacity: 0.8;
                    margin-bottom: 8px;
                }

                .report-header p {
                    margin: 8px 0 0;
                    opacity: 0.92;
                    font-size: 0.96rem;
                    line-height: 1.6;
                }

                .brand-stack {
                    width: 118px;
                    height: 80px;
                    display: grid;
                    place-items: center;
                    background: rgba(255,255,255,0.07);
                    border-radius: 14px;
                    border: 1px solid rgba(255,255,255,0.18);
                    padding: 8px;
                    z-index: 1;
                }

                .summary-bar {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin: 0 0 18px;
                    position: relative;
                    z-index: 1;
                }

                .summary-chip {
                    background: linear-gradient(135deg, var(--accent-soft), #edf9ee);
                    color: var(--primary);
                    border: 1px solid rgba(29, 77, 52, 0.12);
                    border-radius: 999px;
                    padding: 8px 14px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                }

                .section-block {
                    position: relative;
                    z-index: 1;
                    border: 1px solid var(--line);
                    border-radius: 18px;
                    padding: 18px 18px 8px;
                    margin-bottom: 18px;
                    background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(246,250,247,0.96));
                }

                .section-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 14px;
                    padding: 0 4px;
                }

                .section-head h3 {
                    margin: 0;
                    font-size: 1.15rem;
                    color: var(--primary);
                    letter-spacing: -0.02em;
                }

                .section-tag {
                    background: var(--accent-soft);
                    color: var(--primary);
                    border: 1px solid rgba(29,77,52,0.10);
                    border-radius: 999px;
                    padding: 6px 10px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .charts-grid {
                    display: block;
                    width: 100%;
                }

                .report-card {
                    width: 100%;
                    display: block;
                    background: linear-gradient(180deg, #ffffff 0%, #f9fbfa 100%);
                    border: 1px solid var(--line);
                    border-radius: 14px;
                    padding: 12px;
                    box-shadow: 0 8px 20px rgba(24, 50, 35, 0.04);
                    break-inside: avoid;
                    page-break-inside: avoid;
                    page-break-after: auto;
                    margin-bottom: 16px;
                    min-height: 190px;
                }

                .report-card h4 {
                    margin: 0 0 6px;
                    font-size: 0.96rem;
                    color: var(--primary);
                    line-height: 1.4;
                }

                .report-card p {
                    margin: 0 0 10px;
                    font-size: 0.74rem;
                    color: var(--muted);
                    line-height: 1.5;
                }

                .report-card img {
                    display: block;
                    width: 100%;
                    height: auto;
                    max-height: 280px;
                    object-fit: contain;
                    border-radius: 10px;
                    background: #fff;
                    border: 1px solid #eef4ef;
                    break-inside: avoid;
                    page-break-inside: avoid;
                }

                .report-footer {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    padding-top: 14px;
                    border-top: 1px solid var(--line);
                    color: var(--muted);
                    font-size: 0.78rem;
                    margin-top: 10px;
                }

                .report-footer-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: var(--primary);
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .report-footer-brand img {
                    width: 32px;
                    height: 32px;
                    border-radius: 9px;
                }

                .report-footer-meta {
                    color: var(--muted);
                    text-align: right;
                }

                @page {
                    size: A4 portrait;
                    margin: 12mm;
                }

                @media print {
                    html, body {
                        background: #fff;
                        margin: 0;
                        padding: 0;
                    }

                    .report-page {
                        max-width: none;
                        margin: 0;
                        border: none;
                        border-radius: 0;
                        box-shadow: none;
                        padding: 10px 12px 12px;
                    }

                    .ornament {
                        opacity: 0.06;
                    }

                    .report-header,
                    .section-block,
                    .report-card,
                    .report-footer {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }

                    .charts-grid {
                        display: block;
                    }

                    .report-card {
                        page-break-after: auto;
                        min-height: 160px;
                    }

                    .report-card img {
                        max-height: 220px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="report-page">
                <div class="ornament ornament-1"></div>
                <div class="ornament ornament-2"></div>
                <div class="ornament ornament-3"></div>
                <div class="ornament ornament-4"></div>

                <header class="report-header">
                    <div class="report-brand">
                        <div class="brand-badge">
                            <img src="logos/logo1.png" alt="Logo TRAZAR" />
                        </div>
                        <div>
                            <div class="eyebrow">TRAZAR • Monitoreo Agrícola</div>
                            <h1>Reporte de Trazabilidad Ambiental</h1>
                            <p>${contexto.nombre} · ${contexto.cultivo.toUpperCase()} · ${contexto.periodo}</p>
                        </div>
                    </div>
                    <div class="brand-stack">
                        <img src="logos/logo2.png" alt="Logo complemento TRAZAR" />
                    </div>
                </header>

                <div class="summary-bar">
                    <span class="summary-chip">Estación: ${contexto.nombre}</span>
                    <span class="summary-chip">Cultivo: ${contexto.cultivo.toUpperCase()}</span>
                    <span class="summary-chip">Periodo: ${contexto.periodo}</span>
                    <span class="summary-chip">Formato: PDF ejecutivo</span>
                </div>

                <section class="section-block">
                    <div class="section-head">
                        <h3>Gráficas de trazabilidad</h3>
                        <span class="section-tag">Primera página</span>
                    </div>
                    <div class="charts-grid">${chartCards}</div>
                </section>

                <footer class="report-footer">
                    <div class="report-footer-brand">
                        <img src="logos/logo1.png" alt="Logo TRAZAR" />
                        <span>TRAZAR</span>
                    </div>
                    <div class="report-footer-meta">Generado el ${new Date().toLocaleString('es-PE')}</div>
                </footer>
            </div>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank', 'width=1400,height=1100');
    if (!printWindow) {
        alert('El navegador bloqueó la ventana de impresión. Permite las ventanas emergentes para guardar el PDF.');
        return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
    }, 300);
}

function setupTrazabilidadEvents() {
    const nombresGraficas = {
        main: 'evolucion-indicadores',
        temp: 'temperatura-diaria',
        hum: 'humedad-diaria',
        night: 'temperatura-nocturna',
        vpd: 'vpd',
        horas90: 'horas-humedad-mayor-90',
        precipRad: 'precipitacion-radiacion'
    };
    document.querySelectorAll('.btn-download-chart[data-download-chart]').forEach(boton => {
        const key = boton.dataset.downloadChart;
        boton.onclick = () => {
            const chart = trazabilidadChartInstances[key];
            if (chart) descargarGraficaTrazabilidad(chart, nombresGraficas[key]);
        };
    });

    const btnRefresh = document.getElementById('trazabilidadBtnRefresh');
    if (btnRefresh) btnRefresh.addEventListener('click', cargarDatosTrazabilidad);

    const btnPdf = document.getElementById('trazabilidadBtnPdf');
    if (btnPdf) btnPdf.addEventListener('click', generarReportePdfTrazabilidad);

    const btnAnalizar = document.getElementById('trazabilidadAnalizarBtn');
    if (btnAnalizar) {
        btnAnalizar.addEventListener('click', async () => {
            if (!trazabilidadDataGlobal) {
                const panel = document.getElementById('trazabilidadInterpretacionResultado');
                if (panel) {
                    panel.classList.add('empty');
                    panel.textContent = 'Primero selecciona una estación y carga sus datos para analizar la tendencia.';
                }
                return;
            }
            await analizarTrazabilidadConGemini();
        });
    }

    const estacionSelector = document.getElementById('trazabilidadEstacionSelector');
    if (estacionSelector) {
        estacionSelector.addEventListener('change', () => {
            const nombre = estacionSelector.value;
            if (nombre) {
                aplicarRangoFechasTrazabilidad(nombre);
            }
            cargarDatosTrazabilidad();
        });
    }

    const inputInicio = document.getElementById('trazabilidadFechaInicio');
    const inputFin = document.getElementById('trazabilidadFechaFin');
    if (inputInicio) {
        inputInicio.addEventListener('change', () => {
            const nombre = estacionSelector ? estacionSelector.value : '';
            const inicio = parseDateInput(inputInicio.value);
            const fin = parseDateInput(inputFin?.value || '');
            if (inicio && fin && inicio > fin) {
                inputFin.value = inputInicio.value;
            }
            if (nombre) guardarRangoFechasTrazabilidad(nombre, inicio, fin || new Date());
        });
    }
    if (inputFin) {
        inputFin.addEventListener('change', () => {
            const nombre = estacionSelector ? estacionSelector.value : '';
            const inicio = parseDateInput(inputInicio?.value || '');
            const fin = parseDateInput(inputFin.value);
            if (inicio && fin && inicio > fin) {
                inputInicio.value = inputFin.value;
            }
            if (nombre) guardarRangoFechasTrazabilidad(nombre, inicio || new Date(), fin);
        });
    }

    const btnPredeterminadas = document.getElementById('etapasPredeterminadas');
    if (btnPredeterminadas) {
        btnPredeterminadas.addEventListener('click', () => {
            const predeterminadas = getFechasPredeterminadas();
            const ids = ['botonFloral', 'floracion', 'llenadoFruto', 'maduracion', 'cosecha'];
            ids.forEach(key => {
                const input = document.getElementById(`etapa${capitalizeFirstLetter(key)}`);
                if (input && predeterminadas[key]) {
                    input.value = formatDateInput(predeterminadas[key]);
                }
            });
            if (trazabilidadDataGlobal) renderTrazabilidadCompleta();
        });
    }
    const btnAplicar = document.getElementById('etapasAplicar');
    if (btnAplicar) {
        btnAplicar.addEventListener('click', () => {
            if (trazabilidadDataGlobal) {
                renderTrazabilidadCompleta();
            } else {
                alert('Primero carga los datos de una estación haciendo clic en "Actualizar"');
            }
        });
    }
}

function inicializarTrazabilidadCompleta() {
    console.log('🚀 Inicializando módulo de Trazabilidad...');
    inicializarTrazabilidadSelectores();
    setupTrazabilidadEvents();
    setTimeout(() => {
        const selector = document.getElementById('trazabilidadEstacionSelector');
        if (selector && selector.value) {
            cargarDatosTrazabilidad();
        } else if (selector && selector.options.length > 1) {
            selector.selectedIndex = 1;
            cargarDatosTrazabilidad();
        }
    }, 1500);
}

// ============================================================================
// FUNCIONES DE ANÁLISIS TÉRMICO Y HUMEDAD
// ============================================================================

function cargarDatosTermico() {
    const selector = DOM.termicoEstacionSelector;
    if (!selector || !selector.value) { alert('Selecciona una estación'); return; }
    const estacion = ESTACIONES[selector.value];
    const dias = parseInt(DOM.termicoPeriodSelector.value);
    fetchStationData(estacion.channel_id, estacion.api_key, dias).then(datos => {
        if (datos.length === 0) { alert('No se obtuvieron datos'); return; }
        const procesado = procesarDatosTermico(datos);
        const vpdDatos = procesarDatosVPD(datos);
        if (!procesado) { alert('Error al procesar'); return; }
        state.termico.estacionSeleccionada = selector.value;
        state.termico.datos = procesado;
        state.termico.vpdDatos = vpdDatos;
        actualizarStatsTermico(procesado, estacion);
        actualizarTablaTermico(procesado);
        actualizarGraficasTermico(procesado, estacion, vpdDatos);
        DOM.termicoInfoEstacion.textContent = `${estacion.emoji} ${selector.value} - ${estacion.cultivo.toUpperCase()}`;
        DOM.termicoTableInfo.textContent = `${procesado.length} días · ${estacion.cultivo.toUpperCase()}`;
    }).catch(error => { console.error('❌ Error:', error); alert('Error al cargar los datos'); });
}

function procesarDatosTermico(datos) {
    if (!datos || datos.length === 0) return null;
    const diario = {};
    datos.forEach(d => {
        const key = d.timestamp.toDateString();
        if (!diario[key]) diario[key] = { temps: [], hora: [] };
        diario[key].temps.push(d.temperatura);
        diario[key].hora.push({ hora: d.timestamp.getHours(), temp: d.temperatura });
    });
    return Object.keys(diario).map(key => {
        const d = diario[key];
        const temps = d.temps;
        const horas = d.hora;
        const tempMax = Math.max(...temps);
        const tempMin = Math.min(...temps);
        const tempAvg = temps.reduce((a, b) => a + b, 0) / temps.length;
        const nocturnas = horas.filter(h => h.hora >= 19 || h.hora < 6);
        const tempNight = nocturnas.length > 0 ? nocturnas.reduce((a, b) => a + b.temp, 0) / nocturnas.length : tempAvg;
        return { fecha: new Date(key), tempMax, tempMin, tempAvg, tempNight, amplitud: tempMax - tempMin, registros: temps.length };
    }).sort((a, b) => a.fecha - b.fecha);
}

function procesarDatosVPD(datos) {
    if (!datos || datos.length === 0) return [];
    return datos.filter(d => { const h = d.timestamp.getHours(); return h >= 6 && h < 18; }).map(d => ({ timestamp: d.timestamp, temperatura: d.temperatura, humedad: d.humedad, vpd: calcularVPD(d.temperatura, d.humedad) }));
}

function actualizarStatsTermico(datos, estacion) {
    if (!datos || datos.length === 0) return;
    const maxGlobal = datos.reduce((a, b) => a.tempMax > b.tempMax ? a : b);
    const minGlobal = datos.reduce((a, b) => a.tempMin < b.tempMin ? a : b);
    const avgGlobal = datos.reduce((a, b) => a + b.tempAvg, 0) / datos.length;
    const nightGlobal = datos.reduce((a, b) => a + b.tempNight, 0) / datos.length;
    const ampGlobal = datos.reduce((a, b) => a + b.amplitud, 0) / datos.length;
    DOM.termicoStatMax.textContent = formatNumber(maxGlobal.tempMax) + ' °C';
    DOM.termicoStatMaxFecha.textContent = formatDateOnly(maxGlobal.fecha);
    DOM.termicoStatMin.textContent = formatNumber(minGlobal.tempMin) + ' °C';
    DOM.termicoStatMinFecha.textContent = formatDateOnly(minGlobal.fecha);
    DOM.termicoStatAvg.textContent = formatNumber(avgGlobal) + ' °C';
    DOM.termicoStatAvgSub.textContent = `Promedio de ${datos.length} días`;
    DOM.termicoStatNight.textContent = formatNumber(nightGlobal) + ' °C';
    DOM.termicoStatNightSub.textContent = 'Promedio nocturno (20:00-06:00)';
    DOM.termicoStatAmplitude.textContent = formatNumber(ampGlobal) + ' °C';
    DOM.termicoStatAmplitudeSub.textContent = 'Rango promedio diario';
}

function actualizarTablaTermico(datos) {
    if (!datos || datos.length === 0) { DOM.termicoTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No hay datos disponibles</td></tr>'; return; }
    const mostrar = datos.slice(-10).reverse();
    DOM.termicoTableBody.innerHTML = mostrar.map(d => `<tr><td>${formatDateOnly(d.fecha)}</td><td class="temp-high">${formatNumber(d.tempMax)}°C</td><td class="temp-low">${formatNumber(d.tempMin)}°C</td><td class="temp-avg">${formatNumber(d.tempAvg)}°C</td><td class="temp-night">${formatNumber(d.tempNight)}°C</td><td>${formatNumber(d.amplitud)}°C</td></tr>`).join('');
}

function actualizarGraficasTermico(datos, estacion, vpdDatos) {
    if (!datos || datos.length === 0) return;
    const labels = datos.map(d => formatDateOnly(d.fecha));
    const color = estacion.color;
    if (state.termico.chartInstances.avg) state.termico.chartInstances.avg.destroy();
    state.termico.chartInstances.avg = new Chart(DOM.termicoAvgChart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Temperatura Máxima Diaria', data: datos.map(d => d.tempMax), borderColor: '#922e2e', backgroundColor: 'rgba(251, 250, 250, 0.1)', fill: false, tension: 0.3, pointRadius: 1.5, borderDash: [5, 5], borderWidth: 2 },
                { label: 'Temperatura Mínima Diaria', data: datos.map(d => d.tempMin), borderColor: '#13ccd2', backgroundColor: 'rgba(52,152,219,0.1)', fill: false, tension: 0.3, pointRadius: 1.5, borderDash: [5, 5], borderWidth: 2 },
                { label: 'Temperatura Promedio Diaria', data: datos.map(d => d.tempAvg), borderColor: '#fa3200', backgroundColor: 'rgba(255, 153, 0, 0)', fill: true, tension: 0.3, pointRadius: 1.5, borderWidth: 2 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#000000', font: { size: 11 }, usePointStyle: true } } },
            scales: {
                x: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#000000', font: { size: 9 } } },
                y: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#000000', font: { size: 9 } }, title: { display: true, text: 'Temperatura (°C)', color: '#000000', font: { size: 10 } } }
            }
        }
    });
    if (state.termico.chartInstances.night) state.termico.chartInstances.night.destroy();
    state.termico.chartInstances.night = new Chart(DOM.termicoNightChart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Temp. Nocturna (8:00 pm - 06:00 am)', data: datos.map(d => d.tempNight), borderColor: '#242e7d', backgroundColor: 'rgba(30, 58, 117, 0.2)', fill: true, tension: 0.3, pointRadius: 2, borderWidth: 2.0 },
                { label: 'Promedio Diario', data: datos.map(d => d.tempAvg), borderColor: color, backgroundColor: 'transparent', fill: false, tension: 0.3, pointRadius: 2, borderDash: [5, 5], borderWidth: 1.5 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#202223', font: { size: 10 }, usePointStyle: true } } },
            scales: {
                x: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#000000', font: { size: 9 } } },
                y: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#000000', font: { size: 9 } }, title: { display: true, text: 'Temperatura (°C)', color: '#000000', font: { size: 10 } } }
            }
        }
    });
    if (state.termico.chartInstances.vpd) state.termico.chartInstances.vpd.destroy();
    if (vpdDatos && vpdDatos.length > 0) {
        const umbrales = [{ valor: 3, label: 'Peligroso', color: '#e74c3c' }, { valor: 2.41, label: 'Alto estrés', color: '#f39c12' }, { valor: 1.3, label: 'Normal alto', color: '#006a0c' }, { valor: 0.7, label: 'Normal', color: '#2ecc71' }, { valor: 0.37, label: 'Normal bajo', color: '#017571' }, { valor: 0.1, label: 'Hongos', color: '#01f7ff' }];
        state.termico.chartInstances.vpd = new Chart(DOM.termicoVpdChart, {
            type: 'line',
            data: {
                labels: vpdDatos.map(d => formatDate(d.timestamp)),
                datasets: [
                    { label: 'Déficit de Presión de Vapor (kPa)', data: vpdDatos.map(d => d.vpd), borderColor: '#740124', backgroundColor: 'rgba(147, 141, 131, 0)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 1.25 },
                    ...umbrales.map(umbral => ({ type: 'line', label: `Umbral ${umbral.label}`, data: vpdDatos.map(() => umbral.valor), borderColor: umbral.color, borderDash: [6, 6], pointRadius: 0.0, borderWidth: 1.2, fill: false, order: 1, tension: 0, tooltip: { enabled: false } }))
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#000000', font: { size: 10 }, usePointStyle: true } } },
                scales: {
                    x: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#000000', font: { size: 9 }, autoSkip: true, maxTicksLimit: 10 } },
                    y: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#000000', font: { size: 9 } }, title: { display: true, text: 'VPD (kPa)', color: '#000000', font: { size: 10 } } }
                }
            }
        });
    }
    if (state.termico.chartInstances.vpdAlertas) state.termico.chartInstances.vpdAlertas.destroy();
    if (vpdDatos && vpdDatos.length > 0) {
        const alertasPorDia = procesarAlertasVPDPorDia(vpdDatos);
        state.termico.chartInstances.vpdAlertas = new Chart(DOM.termicoVpdAlertasChart, {
            type: 'bar',
            data: {
                labels: alertasPorDia.map(d => formatDateOnly(d.fecha)),
                datasets: [
                    { label: 'Alta Humedad', data: alertasPorDia.map(d => d.categorias.muyHumedo), backgroundColor: '#5DADE2', borderColor: '#5DADE2', borderWidth: 1 },
                    { label: 'Condiciones óptimas', data: alertasPorDia.map(d => d.categorias.optimo), backgroundColor: '#148F77', borderColor: '#148F77', borderWidth: 1 },
                    { label: 'Estres moderado', data: alertasPorDia.map(d => d.categorias.moderado), backgroundColor: '#F1C40F', borderColor: '#F1C40F', borderWidth: 1 },
                    { label: 'Estres severo', data: alertasPorDia.map(d => d.categorias.severo), backgroundColor: '#9D0631', borderColor: '#9D0631', borderWidth: 1 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#000000', font: { size: 10 }, usePointStyle: true } }, tooltip: { callbacks: { label: function(context) { return `${formatNumber(context.raw, 2)} horas`; } } } },
                scales: {
                    x: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#000000', font: { size: 9 } } },
                    y: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#020202', font: { size: 9 } }, title: { display: true, text: 'Horas', color: '#030303', font: { size: 10 } }, beginAtZero: true }
                }
            }
        });
    }
}

function procesarAlertasVPDPorDia(vpdDatos) {
    if (!vpdDatos || vpdDatos.length === 0) return [];
    const diario = {};
    vpdDatos.forEach(d => {
        const key = d.timestamp.toDateString();
        if (!diario[key]) diario[key] = { fecha: new Date(key), categorias: { muyHumedo: 0, optimo: 0, moderado: 0, severo: 0 } };
        const vpd = Number(d.vpd) || 0;
        if (vpd < 0.3) diario[key].categorias.muyHumedo += 1;
        else if (vpd < 1.5) diario[key].categorias.optimo += 1;
        else if (vpd < 3) diario[key].categorias.moderado += 1;
        else diario[key].categorias.severo += 1;
    });
    return Object.keys(diario).map(key => ({ fecha: diario[key].fecha, categorias: { muyHumedo: (diario[key].categorias.muyHumedo * 10) / 60, optimo: (diario[key].categorias.optimo * 10) / 60, moderado: (diario[key].categorias.moderado * 10) / 60, severo: (diario[key].categorias.severo * 10) / 60 } })).sort((a, b) => a.fecha - b.fecha);
}

function cargarDatosHumedad() {
    const selector = DOM.humedadEstacionSelector;
    if (!selector || !selector.value) { alert('Selecciona una estación'); return; }
    const estacion = ESTACIONES[selector.value];
    const dias = parseInt(DOM.humedadPeriodSelector.value);
    fetchStationData(estacion.channel_id, estacion.api_key, dias).then(datos => {
        if (datos.length === 0) { alert('No se obtuvieron datos'); return; }
        const procesado = procesarDatosHumedad(datos);
        const puntoRocioDatos = procesarDatosPuntoRocio(datos);
        if (!procesado) { alert('Error al procesar'); return; }
        state.humedad.estacionSeleccionada = selector.value;
        state.humedad.datos = procesado;
        actualizarStatsHumedad(procesado, estacion);
        actualizarTablaHumedad(procesado);
        actualizarGraficasHumedad(procesado, estacion, puntoRocioDatos);
        DOM.humedadInfoEstacion.textContent = `${estacion.emoji} ${selector.value} - ${estacion.cultivo.toUpperCase()}`;
        DOM.humedadTableInfo.textContent = `${procesado.length} días · ${estacion.cultivo.toUpperCase()}`;
    }).catch(error => { console.error('❌ Error:', error); alert('Error al cargar los datos'); });
}

function procesarDatosHumedad(datos) {
    if (!datos || datos.length === 0) return null;
    const diario = {};
    datos.forEach(d => {
        const key = d.timestamp.toDateString();
        if (!diario[key]) diario[key] = { humedades: [] };
        diario[key].humedades.push(d.humedad);
    });
    return Object.keys(diario).map(key => {
        const d = diario[key];
        const humedades = d.humedades;
        const humMax = Math.max(...humedades);
        const humMin = Math.min(...humedades);
        const humAvg = humedades.reduce((a, b) => a + b, 0) / humedades.length;
        const humRange = humMax - humMin;
        const humExceso = humedades.filter(h => h > 80).length;
        const horasSobre90 = (humedades.filter(h => h > 90).length * 10) / 60;
        return { fecha: new Date(key), humMax, humMin, humAvg, humRange, humExceso, horasSobre90, registros: humedades.length };
    }).sort((a, b) => a.fecha - b.fecha);
}

function procesarDatosPuntoRocio(datos) {
    if (!datos || datos.length === 0) return [];
    return datos.map(d => ({ timestamp: d.timestamp, indiceHelada: calcularIndicePotencialHelada(d.temperatura, d.humedad) }));
}

function calcularIndicePotencialHelada(temperatura, humedad) {
    const temp = Number(temperatura);
    const hr = Number(humedad);
    if (!Number.isFinite(temp) || !Number.isFinite(hr)) return 0;
    const td = (Math.pow(Math.max(0, Math.min(100, hr)) / 100, 1 / 8) * (110 + temp)) - 110;
    return temp - td;
}

function actualizarStatsHumedad(datos, estacion) {
    if (!datos || datos.length === 0) return;
    const maxGlobal = datos.reduce((a, b) => a.humMax > b.humMax ? a : b);
    const minGlobal = datos.reduce((a, b) => a.humMin < b.humMin ? a : b);
    const avgGlobal = datos.reduce((a, b) => a + b.humAvg, 0) / datos.length;
    const rangeGlobal = datos.reduce((a, b) => a + b.humRange, 0) / datos.length;
    const excesoTotal = datos.reduce((a, b) => a + b.humExceso, 0);
    DOM.humedadStatMax.textContent = formatNumber(maxGlobal.humMax) + ' %';
    DOM.humedadStatMaxFecha.textContent = formatDateOnly(maxGlobal.fecha);
    DOM.humedadStatMin.textContent = formatNumber(minGlobal.humMin) + ' %';
    DOM.humedadStatMinFecha.textContent = formatDateOnly(minGlobal.fecha);
    DOM.humedadStatAvg.textContent = formatNumber(avgGlobal) + ' %';
    DOM.humedadStatAvgSub.textContent = `Promedio de ${datos.length} días`;
    DOM.humedadStatRange.textContent = formatNumber(rangeGlobal) + ' %';
    DOM.humedadStatRangeSub.textContent = 'Rango promedio diario';
    DOM.humedadStatExceso.textContent = excesoTotal;
    DOM.humedadStatExcesoSub.textContent = 'Días con HR > 80%';
}

function actualizarTablaHumedad(datos) {
    if (!datos || datos.length === 0) { DOM.humedadTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No hay datos disponibles</td></tr>'; return; }
    const mostrar = datos.slice(-10).reverse();
    DOM.humedadTableBody.innerHTML = mostrar.map(d => {
        let estado = 'Normal', estadoClass = 'hum-avg';
        if (d.humAvg > 80) { estado = '⚠️ Exceso de Humedad'; estadoClass = 'hum-exceso'; }
        else if (d.humAvg < 50) { estado = '⚠️ Baja Humedad'; estadoClass = 'hum-low'; }
        return `<tr><td>${formatDateOnly(d.fecha)}</td><td class="hum-high">${formatNumber(d.humMax)}%</td><td class="hum-low">${formatNumber(d.humMin)}%</td><td class="hum-avg">${formatNumber(d.humAvg)}%</td><td>${formatNumber(d.humRange)}%</td><td><span class="${estadoClass}">${estado}</span></td></tr>`;
    }).join('');
}

function actualizarGraficasHumedad(datos, estacion, puntoRocioDatos) {
    if (!datos || datos.length === 0) return;
    const labels = datos.map(d => formatDateOnly(d.fecha));
    const color = estacion.color;
    const colorLight = estacion.colorLight;
    if (state.humedad.chartInstances.avg) state.humedad.chartInstances.avg.destroy();
    state.humedad.chartInstances.avg = new Chart(DOM.humedadAvgChart, {
        type: 'line',
        data: { labels: labels, datasets: [{ label: 'Humedad Promedio Diaria', data: datos.map(d => d.humAvg), borderColor: color, backgroundColor: colorLight, fill: true, tension: 0.3, pointRadius: 4, borderWidth: 2.5 }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#b0bec5', font: { size: 11 }, usePointStyle: true } } },
            scales: { x: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#78909c', font: { size: 9 } } }, y: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#78909c', font: { size: 9 } }, min: 30, max: 100, title: { display: true, text: 'Humedad (%)', color: '#78909c', font: { size: 10 } } } }
        }
    });
    if (state.humedad.chartInstances.minMax) state.humedad.chartInstances.minMax.destroy();
    state.humedad.chartInstances.minMax = new Chart(DOM.humedadMinMaxChart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: '💧 Máxima Diaria', data: datos.map(d => d.humMax), borderColor: '#3498db', backgroundColor: 'rgba(52,152,219,0.1)', fill: true, tension: 0.3, pointRadius: 4, borderWidth: 2.5 },
                { label: '💧 Mínima Diaria', data: datos.map(d => d.humMin), borderColor: '#9b59b6', backgroundColor: 'rgba(155,89,182,0.1)', fill: true, tension: 0.3, pointRadius: 4, borderWidth: 2.5 },
                { label: '📊 Promedio', data: datos.map(d => d.humAvg), borderColor: color, backgroundColor: 'transparent', fill: false, tension: 0.3, pointRadius: 4, borderWidth: 2.5, borderDash: [5, 5] }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#b0bec5', font: { size: 10 }, usePointStyle: true } } },
            scales: { x: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#78909c', font: { size: 9 } } }, y: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#78909c', font: { size: 9 } }, min: 30, max: 100, title: { display: true, text: 'Humedad (%)', color: '#78909c', font: { size: 10 } } } }
        }
    });
    if (state.humedad.chartInstances.dist) state.humedad.chartInstances.dist.destroy();
    const rangos = [{ label: '< 40%', min: 0, max: 40 }, { label: '40-60%', min: 40, max: 60 }, { label: '60-70%', min: 60, max: 70 }, { label: '70-80%', min: 70, max: 80 }, { label: '80-90%', min: 80, max: 90 }, { label: '> 90%', min: 90, max: 100 }];
    const distribucion = rangos.map(r => datos.filter(d => d.humAvg >= r.min && d.humAvg < r.max).length);
    state.humedad.chartInstances.dist = new Chart(DOM.humedadDistChart, {
        type: 'bar',
        data: {
            labels: rangos.map(r => r.label),
            datasets: [{ label: 'Días por Rango de Humedad', data: distribucion, backgroundColor: ['rgba(155,89,182,0.7)', 'rgba(52,152,219,0.7)', 'rgba(46,204,113,0.7)', 'rgba(243,156,18,0.7)', 'rgba(231,76,60,0.7)', 'rgba(192,57,43,0.7)'], borderColor: ['#9b59b6', '#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#c0392b'], borderWidth: 1, borderRadius: 4 }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#b0bec5', font: { size: 10 }, usePointStyle: true } } },
            scales: { x: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'Rango de Humedad (%)', color: '#78909c', font: { size: 10 } } }, y: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'Número de Días', color: '#78909c', font: { size: 10 } }, beginAtZero: true } }
        }
    });
    if (state.humedad.chartInstances.horas90) state.humedad.chartInstances.horas90.destroy();
    state.humedad.chartInstances.horas90 = new Chart(DOM.humedadHoras90Chart, {
        type: 'bar',
        data: { labels: labels, datasets: [{ label: 'Horas con HR > 90%', data: datos.map(d => d.horasSobre90), backgroundColor: 'rgba(46, 204, 113, 0.7)', borderColor: '#2ecc71', borderWidth: 1, borderRadius: 4 }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#b0bec5', font: { size: 10 }, usePointStyle: true } } },
            scales: { x: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'Fecha', color: '#78909c', font: { size: 10 } } }, y: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: 'Horas', color: '#78909c', font: { size: 10 } }, beginAtZero: true } }
        }
    });
    if (state.humedad.chartInstances.puntoRocio) state.humedad.chartInstances.puntoRocio.destroy();
    if (puntoRocioDatos && puntoRocioDatos.length > 0) {
        state.humedad.chartInstances.puntoRocio = new Chart(DOM.humedadPuntoRocioChart, {
            type: 'line',
            data: {
                labels: puntoRocioDatos.map(d => formatDate(d.timestamp)),
                datasets: [{ label: 'Índice de Potencial de Helada (°C)', data: puntoRocioDatos.map(d => d.indiceHelada), borderColor: '#00bcd4', backgroundColor: 'rgba(0, 188, 212, 0.15)', fill: true, tension: 0.3, pointRadius: 2, borderWidth: 2 }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#b0bec5', font: { size: 10 }, usePointStyle: true } } },
                scales: {
                    x: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#78909c', font: { size: 9 }, autoSkip: true, maxTicksLimit: 10 }, title: { display: true, text: 'Fecha y Hora', color: '#78909c', font: { size: 10 } } },
                    y: { grid: { color: 'rgba(42,58,78,0.1)' }, ticks: { color: '#78909c', font: { size: 9 } }, title: { display: true, text: '°C', color: '#78909c', font: { size: 10 } } }
                }
            }
        });
    }
}

// ============================================================================
// NAVEGACIÓN
// ============================================================================
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const dashboardChartsPanel = document.getElementById('dashboardChartsPanel');
    const titles = {
        dashboard: 'Dashboard General',
        cultivos: 'Gestión de Cultivos',
        estaciones: 'Estaciones Meteorológicas',
        fenologia: 'Monitoreo Fenológico',
        calidad: 'Índice de Calidad',
        'analisis-termico': 'Análisis Térmico',
        'analisis-humedad': 'Análisis de Humedad',
        alertas: 'Sistema de Alertas',
        reportes: 'Generación de Reportes',
        trazabilidad: 'TRAZABILIDAD AMBIENTAL DE PRODUCCIÓN',
        'ficha-agronomica': 'FICHA TÉCNICA AGRONÓMICA'
    };
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            link.closest('.nav-item').classList.add('active');
            const target = link.getAttribute('href').substring(1);
            sections.forEach(section => section.classList.toggle('active', section.id === target));
            if (dashboardChartsPanel) {
                dashboardChartsPanel.style.display = target === 'dashboard' ? 'block' : 'none';
            }
            DOM.pageTitle.textContent = titles[target] || target;
            DOM.pageSubtitle.textContent = 'Monitoreo en tiempo real';
            if (target === 'cultivos') setTimeout(refreshCultivosCorrelationCharts, 100);
            document.querySelector('.sidebar').classList.remove('open');
        });
    });
}

function refreshCultivosCorrelationCharts() {
    if (!state.estaciones || Object.keys(state.estaciones).length === 0) return;
    if (state.chartInstances.altitudTemp && state.chartInstances.altitudHum) {
        [state.chartInstances.altitudTemp, state.chartInstances.altitudHum].forEach(chart => {
            if (chart) { if (typeof chart.resize === 'function') chart.resize(); if (typeof chart.update === 'function') chart.update(); }
        });
    }
    renderAltitudCorrelationCharts(state.estaciones);
}

function setupMenuToggle() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !toggle.contains(e.target)) sidebar.classList.remove('open');
        }
    });
}

function setupSidebarCollapse() {
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    const body = document.body;
    if (!collapseBtn) return;

    collapseBtn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            document.querySelector('.sidebar').classList.toggle('open');
            return;
        }

        const isCollapsed = body.classList.toggle('sidebar-collapsed');
        collapseBtn.setAttribute('aria-label', isCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral');
    });
}

function setupChartControls() {
    const buttons = document.querySelectorAll('.btn-chart');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMainChart(state.estaciones);
        });
    });
    DOM.periodSelector.addEventListener('change', actualizarSistema);
    DOM.termicoBtnRefresh.addEventListener('click', cargarDatosTermico);
    DOM.termicoPeriodSelector.addEventListener('change', cargarDatosTermico);
    DOM.humedadBtnRefresh.addEventListener('click', cargarDatosHumedad);
    DOM.humedadPeriodSelector.addEventListener('change', cargarDatosHumedad);
}

function inicializarSelectores() {
    const termicoSelector = DOM.termicoEstacionSelector;
    if (termicoSelector) {
        termicoSelector.innerHTML = '<option value="">🔽 Selecciona una estación...</option>';
        Object.keys(ESTACIONES)
            .filter(nombre => !ESTACIONES[nombre].isVirtual)
            .forEach(nombre => {
                const est = ESTACIONES[nombre];
                const option = document.createElement('option');
                option.value = nombre;
                option.textContent = `${nombre} (${est.cultivo.toUpperCase()})`;
                option.style.color = est.color;
                termicoSelector.appendChild(option);
            });
        const estacionesDisponibles = Object.keys(ESTACIONES).filter(nombre => !ESTACIONES[nombre].isVirtual);
        if (estacionesDisponibles.length > 0) {
            termicoSelector.value = estacionesDisponibles[0];
            setTimeout(cargarDatosTermico, 300);
        }
    }
    const humedadSelector = DOM.humedadEstacionSelector;
    if (humedadSelector) {
        humedadSelector.innerHTML = '<option value="">🔽 Selecciona una estación...</option>';
        Object.keys(ESTACIONES)
            .filter(nombre => !ESTACIONES[nombre].isVirtual)
            .forEach(nombre => {
                const est = ESTACIONES[nombre];
                const option = document.createElement('option');
                option.value = nombre;
                option.textContent = `${nombre} (${est.cultivo.toUpperCase()})`;
                option.style.color = est.color;
                humedadSelector.appendChild(option);
            });
        const estacionesDisponibles = Object.keys(ESTACIONES).filter(nombre => !ESTACIONES[nombre].isVirtual);
        if (estacionesDisponibles.length > 0) {
            humedadSelector.value = estacionesDisponibles[0];
            setTimeout(cargarDatosHumedad, 300);
        }
    }
    inicializarReportes();
}

function inicializarReportes() {
    inicializarSelectorReporte();
    const btnGenerar = document.getElementById('reporteBtnGenerar');
    const btnExportar = document.getElementById('reporteBtnExportar');
    if (btnGenerar) btnGenerar.addEventListener('click', generarReporte);
    if (btnExportar) btnExportar.addEventListener('click', exportarReportePDF);

    const btnPdfGenerar = document.getElementById('reportePdfGenerarBtn');
    const btnPdfDescargar = document.getElementById('reportePdfDescargarBtn');
    if (btnPdfGenerar) btnPdfGenerar.addEventListener('click', generarVistaPreviaReportePdf);
    if (btnPdfDescargar) btnPdfDescargar.addEventListener('click', descargarReportePdfDesdeVista);
}

function obtenerHtmlInterpretacionTrazabilidad() {
    const panel = document.getElementById('trazabilidadInterpretacionResultado');
    if (!panel) return 'Sin interpretación disponible.';
    const html = panel.innerHTML.trim();
    return html && !html.includes('Selecciona una estación') ? html : 'No se generó interpretación de Gemini para esta estación.';
}

function obtenerImagenCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return '';
    return canvas.toDataURL('image/png');
}

function generarVistaPreviaReportePdf() {
    const preview = document.getElementById('reportePdfPreview');
    if (!preview) return;

    const contexto = obtenerContextoInterpretacionTrazabilidad();
    if (!contexto || !trazabilidadDataGlobal || !trazabilidadDataGlobal.diario || trazabilidadDataGlobal.diario.length === 0) {
        preview.innerHTML = '<div class="reporte-pdf-empty">Primero selecciona una estación y carga la trazabilidad para generar el reporte PDF.</div>';
        return;
    }

    const chartIds = ['trazabilidadMainChart', 'trazabilidadTempChart', 'trazabilidadHumChart'];
    const chartMarkup = chartIds
        .map(id => {
            const dataUrl = obtenerImagenCanvas(id);
            return dataUrl ? `<div class="reporte-pdf-chart"><img src="${dataUrl}" alt="Gráfica de ${id}" /></div>` : '';
        })
        .join('');

    const resumen = `
        <div class="reporte-pdf-document">
            <div class="reporte-pdf-header">
                <h3>📄 Reporte de Trazabilidad Agrícola</h3>
                <p>Estación: ${contexto.nombre} • Cultivo: ${contexto.cultivo.toUpperCase()} • Período: ${contexto.periodo}</p>
            </div>

            <div class="reporte-pdf-summary">
                <div class="reporte-pdf-summary-item"><strong>Temperatura media</strong><span>${formatNumber(contexto.tempMean, 1)}°C</span></div>
                <div class="reporte-pdf-summary-item"><strong>Humedad media</strong><span>${formatNumber(contexto.humedadMean, 0)}%</span></div>
                <div class="reporte-pdf-summary-item"><strong>Precipitación total</strong><span>${formatNumber(contexto.precipTotal, 1)} mm</span></div>
                <div class="reporte-pdf-summary-item"><strong>GDD acumulado</strong><span>${formatNumber(contexto.gddTotal, 1)}</span></div>
                <div class="reporte-pdf-summary-item"><strong>Etapa actual</strong><span>${contexto.etapaActual}</span></div>
                <div class="reporte-pdf-summary-item"><strong>Registros</strong><span>${trazabilidadDataGlobal.diario.length}</span></div>
            </div>

            <div class="reporte-pdf-section">
                <h4>🔎 Interpretación de Gemini</h4>
                <div class="reporte-pdf-interpretacion">${obtenerHtmlInterpretacionTrazabilidad()}</div>
            </div>

            <div class="reporte-pdf-section">
                <h4>📊 Granulación visual del análisis</h4>
                <div class="reporte-pdf-grid">${chartMarkup}</div>
            </div>
        </div>
    `;

    preview.innerHTML = resumen;
}

function descargarReportePdfDesdeVista() {
    const preview = document.getElementById('reportePdfPreview');
    if (!preview || preview.innerHTML.includes('Primero selecciona')) {
        alert('Primero genera la vista previa del reporte PDF.');
        return;
    }

    const contenido = preview.cloneNode(true);
    const printWindow = window.open('', '_blank', 'width=1200,height=900');
    if (!printWindow) {
        alert('La ventana emergente fue bloqueada. Permite ventanas emergentes para descargar el PDF.');
        return;
    }

    const html = `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8" />
        <title>Reporte de Trazabilidad</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1f2d3d; background: #fff; }
            h3 { margin: 0 0 8px; font-size: 26px; }
            p { margin: 4px 0; color: #495867; }
            .reporte-pdf-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin: 20px 0; }
            .reporte-pdf-summary-item { border: 1px solid #dfe6ec; border-radius: 10px; padding: 12px; background: #f8fbf9; }
            .reporte-pdf-summary-item strong { display: block; font-size: 12px; color: #5a6774; margin-bottom: 6px; }
            .reporte-pdf-summary-item span { font-size: 16px; font-weight: 700; }
            .reporte-pdf-section { border: 1px solid #dfe6ec; border-radius: 12px; padding: 16px; margin-top: 18px; }
            .reporte-pdf-section h4 { margin: 0 0 12px; font-size: 18px; }
            .reporte-pdf-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
            .reporte-pdf-chart { border: 1px solid #dfe6ec; border-radius: 10px; padding: 10px; }
            .reporte-pdf-chart img { width: 100%; height: auto; display: block; }
        </style>
    </head>
    <body>
        ${contenido.outerHTML}
    </body>
    </html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// ============================================================================
// ACTUALIZACIÓN COMPLETA DEL SISTEMA
// ============================================================================
async function actualizarSistema() {
    if (state.isLoading) return;
    state.isLoading = true;
    DOM.btnRefresh.disabled = true;
    DOM.btnRefresh.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
    try {
        const dias = parseInt(DOM.periodSelector.value) || 10;
        CONFIG.DIAS_ANALISIS = dias;
        const data = await obtenerDatosTodasEstaciones(dias);
        if (Object.keys(data).length === 0) { console.warn('⚠️ No se obtuvieron datos de ninguna estación'); return; }
        renderKPI(data);
        renderGraficasIndividuales(data);
        renderScatterChart(data);
        renderAltitudCorrelationCharts(data);
        renderMainChart(data);
        renderGraficaLonya(data);
        renderFenologia(data);
        renderCalidad(data);
        renderAlertas(state.alertas);
        if (mapaInicializado) actualizarMapaEstaciones();
        const ahora = new Date();
        DOM.ultimaActualizacion.textContent = `Actualizado: ${ahora.toLocaleTimeString('es-PE')}`;
        document.querySelector('#estacionesActivas').textContent = `${Object.keys(data).length} Activas`;
        document.querySelector('#cultivosBadge').textContent = Object.keys(data).length;
        state.ultimaActualizacion = ahora;
        console.log('✅ Sistema actualizado correctamente');
    } catch (error) {
        console.error('❌ Error al actualizar sistema:', error);
    } finally {
        state.isLoading = false;
        DOM.btnRefresh.disabled = false;
        DOM.btnRefresh.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
    }
}

// ============================================================================
// INICIALIZACIÓN
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando AgroMonitor Pro v3.0...');
    console.log('📊 Con Mapa, Análisis Térmico, Humedad, Reportes y Trazabilidad');
    
    moment.locale('es');
    
    setupNavigation();
    setupMenuToggle();
    setupSidebarCollapse();
    setupChartControls();
    inicializarSelectores();
    inicializarMapaYObserver();
    inicializarTrazabilidadCompleta();
    inicializarEventosFichaTecnica();
    
    await actualizarSistema();
    setInterval(actualizarSistema, CONFIG.INTERVALO_ACTUALIZACION);
    
    console.log('✅ Sistema listo');
});

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        Object.keys(state.chartInstances).forEach(key => {
            if (state.chartInstances[key] && state.chartInstances[key].resize) {
                state.chartInstances[key].resize();
            }
        });
        Object.keys(state.termico.chartInstances).forEach(key => {
            if (state.termico.chartInstances[key] && state.termico.chartInstances[key].resize) {
                state.termico.chartInstances[key].resize();
            }
        });
        Object.keys(state.humedad.chartInstances).forEach(key => {
            if (state.humedad.chartInstances[key] && state.humedad.chartInstances[key].resize) {
                state.humedad.chartInstances[key].resize();
            }
        });
        Object.keys(reporteChartInstances).forEach(key => {
            if (reporteChartInstances[key] && reporteChartInstances[key].resize) {
                reporteChartInstances[key].resize();
            }
        });
        Object.keys(trazabilidadChartInstances).forEach(key => {
            if (trazabilidadChartInstances[key] && trazabilidadChartInstances[key].resize) {
                trazabilidadChartInstances[key].resize();
            }
        });
        if (mapaEstaciones) mapaEstaciones.invalidateSize();
    }, 250);
});

// Exponer funciones globales
window.generarReporteCultivo = function() { alert('Usa la sección "Reportes" para generar reportes personalizados'); };
window.generarReporteEstacion = function() { alert('Usa la sección "Reportes" para generar reportes personalizados'); };
window.generarReporteEjecutivo = function() { alert('Usa la sección "Reportes" para generar reportes personalizados'); };
window.generarTrazabilidad = function() { alert('Usa la sección "Trazabilidad" para generar la trazabilidad'); };
window.generarQR = function() { alert('Usa la sección "Trazabilidad" para generar el QR'); };
window.generarReporte = generarReporte;
window.exportarReportePDF = exportarReportePDF;