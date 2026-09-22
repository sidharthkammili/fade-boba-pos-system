// src/pages/MenuBoard.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDrinks, fetchOrderQueue } from '../api/api';
import bobaTestImg from '../images/boba_test.svg';
import avocadoSmoothieImg from '../images/avacadosmoothie.svg';
import bananaSmoothieImg from '../images/bananasmoothie.svg';
import blueberryFruitTeaImg from '../images/blueberryfruittea.svg';
import brewedBlackTeaImg from '../images/brewedblacktea.svg';
import chocolateSlushImg from '../images/chocolateslush.svg';
import coffeeSlushImg from '../images/coffeeslush.svg';
import classicMilkTeaImg from '../images/classicmilktea.svg';
import dragonfruitSlushImg from '../images/dragonfruitslush.svg';
import durianSmoothieImg from '../images/duriansmoothie.svg';
import earlGreyMilkTeaImg from '../images/earlgreymilktea.svg';
import jasmineMilkTeaImg from '../images/jasminemilktea.svg';
import kiwiFruitTeaImg from '../images/kiwifruittea.svg';
import lycheeFruitTeaImg from '../images/lycheefruittea.svg';
import mangoFruitTeaImg from '../images/mangofruittea.svg';
import mangoSlushImg from '../images/mangoslush.svg';
import mangoSmoothieImg from '../images/mangosmoothie.svg';
import matchaSmoothieImg from '../images/matchasmoothie.svg';
import mixedBerrySlushImg from '../images/mixedberryslush.svg';
import oolongMilkTeaImg from '../images/oolongmilktea.svg';
import papayaSmoothieImg from '../images/papayasmoothie.svg';
import passionFruitTeaImg from '../images/passionfruittea.svg';
import peachFruitTeaImg from '../images/peachfruittea.svg';
import pineappleSlushImg from '../images/pineappleslush.svg';
import raspberryFruitTeaImg from '../images/raspberryfruittea.svg';
import roseMilkTeaImg from '../images/rosemilktea.svg';
import strawberryFruitTeaImg from '../images/strawberryfruittea.svg';
import strawberrySlushImg from '../images/strawberryslush.svg';
import strawberrySmoothieImg from '../images/strawberrysmoothie.svg';
import taroMilkTeaImg from '../images/taromilktea.svg';
import taroSmoothieImg from '../images/tarosmoothie.svg';
import thaiMilkTeaImg from '../images/thaimilktea.svg';
import watermelonSlushImg from '../images/watermelonslush.svg';
import winterMelonMilkTeaImg from '../images/wintermelonmilktea.svg';
import brewedChrysanthemumTeaImg from '../images/brewedchrysanthemumtea.svg';
import brewedEarlGreyTeaImg from '../images/brewedearlgreytea.svg';
import brewedGreenTeaImg from '../images/brewedgreentea.svg';
import brewedHibiscusTeaImg from '../images/brewedhibiscustea.svg';
import brewedJasmineTeaImg from '../images/brewedjasminetea.svg';
import brewedOolongTeaImg from '../images/brewedoolongtea.svg';
import brewedPeppermintTeaImg from '../images/brewedpepperminttea.svg';
import brownSugarBobaImg from '../images/brownsugarboba.svg';
import grapefruitGreenTeaImg from '../images/grapefruitgreentea.svg';
import lycheeGreenTeaImg from '../images/lycheegreentea.svg';
import mangoGreenTeaImg from '../images/mangogreentea.svg';
import matchaLatteImg from '../images/matchalatte.svg';
import passionFruitGreenTeaImg from '../images/passionfruitgreentea.svg';
import peachGreenTeaImg from '../images/peachgreentea.svg';
import yakultGreenTeaImg from '../images/yakultgreentea.svg';
import hotCoffeeImg from '../images/hotcoffee.svg';
import tropicalSummerImg from '../images/tropicalsummer.svg';
import beachVacationImg from '../images/beachvacation.svg';

const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=30.628&longitude=-96.3344&current_weather=true&temperature_unit=fahrenheit';

const STATUS_COLORS = {
  'pending':     '#F59E0B',
  'in progress': '#3B82F6',
  'ready':       '#4ADE80',
};

const STATUS_LABEL = {
  'pending':     '⏳ Preparing',
  'in progress': '🔧 In Progress',
  'ready':       '✅ Ready for Pickup!',
};

function getWeatherEmoji(code) {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  return '⛈️';
}

function getDrinkImage(itemName) {
  const normalized = itemName.toLowerCase().replace(/[^a-z]/g, '');
  const imageMap = {
    avocadosmoothie: avocadoSmoothieImg,
    bananasmoothie: bananaSmoothieImg,
    blueberryfruittea: blueberryFruitTeaImg,
    brewedblacktea: brewedBlackTeaImg,
    chocolateslush: chocolateSlushImg,
    coffeeslush: coffeeSlushImg,
    classicmilktea: classicMilkTeaImg,
    dragonfruitslush: dragonfruitSlushImg,
    duriansmoothie: durianSmoothieImg,
    earlgreymilktea: earlGreyMilkTeaImg,
    jasminemilktea: jasmineMilkTeaImg,
    kiwifruittea: kiwiFruitTeaImg,
    lycheefruittea: lycheeFruitTeaImg,
    mangofruittea: mangoFruitTeaImg,
    mangoslush: mangoSlushImg,
    mangosmoothie: mangoSmoothieImg,
    matchasmoothie: matchaSmoothieImg,
    mixedberryslush: mixedBerrySlushImg,
    oolongmilktea: oolongMilkTeaImg,
    papayasmoothie: papayaSmoothieImg,
    passionfruittea: passionFruitTeaImg,
    peachfruittea: peachFruitTeaImg,
    pineappleslush: pineappleSlushImg,
    raspberryfruittea: raspberryFruitTeaImg,
    rosemilktea: roseMilkTeaImg,
    strawberryfruittea: strawberryFruitTeaImg,
    strawberryslush: strawberrySlushImg,
    strawberrysmoothie: strawberrySmoothieImg,
    taromilktea: taroMilkTeaImg,
    tarosmoothie: taroSmoothieImg,
    thaimilktea: thaiMilkTeaImg,
    watermelonslush: watermelonSlushImg,
    wintermelonmilktea: winterMelonMilkTeaImg,
    brewedchrysanthemumtea: brewedChrysanthemumTeaImg,
    brewedearlgreytea: brewedEarlGreyTeaImg,
    brewedgreentea: brewedGreenTeaImg,
    brewedhibiscustea: brewedHibiscusTeaImg,
    brewedjasminetea: brewedJasmineTeaImg,
    brewedoolongtea: brewedOolongTeaImg,
    brewedpepperminttea: brewedPeppermintTeaImg,
    brownsugarboba: brownSugarBobaImg,
    grapefruitgreentea: grapefruitGreenTeaImg,
    lycheegreentea: lycheeGreenTeaImg,
    mangogreentea: mangoGreenTeaImg,
    matchalatte: matchaLatteImg,
    passionfruitgreentea: passionFruitGreenTeaImg,
    peachgreentea: peachGreenTeaImg,
    yakultgreentea: yakultGreenTeaImg,
    hotcoffee: hotCoffeeImg,
    tropicalsummer: tropicalSummerImg,
    beachvacation: beachVacationImg,
  };
  return imageMap[normalized] || bobaTestImg;
}

function getRecommendedDrink(tempF) {
  if (tempF >= 85) return 'Strawberry Slush';
  if (tempF >= 70) return 'Brown Sugar Boba';
  if (tempF >= 55) return 'Thai Milk Tea';
  return 'Classic Milk Tea';
}

export default function MenuBoard() {
  const navigate = useNavigate();
  const [drinks,      setDrinks]      = useState([]);
  const [queue,       setQueue]       = useState([]);
  const [time,        setTime]        = useState(new Date());
  const [weather,     setWeather]     = useState(null);
  const [recommended, setRecommended] = useState(null);
  const scrollRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    fetchDrinks().then(d => setDrinks(Array.isArray(d) ? d : []));
    fetchOrderQueue().then(d => setQueue(Array.isArray(d) ? d : []));

    fetch(WEATHER_URL)
      .then(r => r.json())
      .then(data => {
        const { temperature, weathercode, windspeed } = data.current_weather;
        const temp = Math.round(temperature);
        setWeather({ temp, code: weathercode, wind: Math.round(windspeed) });
        setRecommended(getRecommendedDrink(temp));
      })
      .catch(() => {});

    const tick     = setInterval(() => setTime(new Date()), 60000);
    const queueRef = setInterval(() => {
      fetchOrderQueue().then(d => setQueue(Array.isArray(d) ? d : []));
    }, 15000);

    return () => { clearInterval(tick); clearInterval(queueRef); };
  }, []);

  // Auto-scroll loop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || drinks.length === 0) return;

    let pos = 0;
    const speed = 0.5; // pixels per frame — adjust to taste

    const step = () => {
      pos += speed;
      // When we've scrolled past the first copy, reset to top seamlessly
      if (pos >= el.scrollHeight / 2) pos = 0;
      el.scrollTop = pos;
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [drinks]);

  const activeQueue = queue.filter(o => o.status !== 'completed');

  // Sort drinks so recommended is first
  const sortedDrinks = recommended
    ? [...drinks].sort((a, b) => {
        if (a.item_name === recommended) return -1;
        if (b.item_name === recommended) return 1;
        return 0;
      })
    : drinks;

  // Duplicate for seamless loop
  const loopDrinks = [...sortedDrinks, ...sortedDrinks];

  return (
    <div style={styles.bg}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')} aria-label="Return to portal">
          ← Home
        </button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={styles.logo}>🧋 Fade Boba</h1>
          <p style={styles.tagline}>Premium Bubble Tea</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <div style={styles.clock}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          {weather && (
            <div style={styles.weatherBadge}>
              {getWeatherEmoji(weather.code)} {weather.temp}°F
            </div>
          )}
        </div>
      </div>

      <div style={styles.body}>
        {/* Left: Scrolling menu */}
        <div style={styles.menuSection}>
          {/* Overflow hidden wrapper — hides scrollbar */}
          <div style={styles.scrollWrapper}>
            <div ref={scrollRef} style={styles.scrollInner}>
              <div style={styles.menuGrid}>
                {loopDrinks.map((d, idx) => {
                  const isRec = d.item_name === recommended;
                  return (
                    <div key={`${d.menu_item_id}-${idx}`} style={{
                      ...styles.menuItem,
                      ...(isRec ? styles.recItem : {}),
                    }}>
                      {isRec && (
                        <div style={styles.recBadge}>
                          {getWeatherEmoji(weather?.code)} Weather Pick
                        </div>
                      )}
                      <img
                        src={getDrinkImage(d.item_name)}
                        alt={d.item_name}
                        style={styles.itemImage}
                        loading="lazy"
                      />
                      <span style={{ ...styles.itemName, ...(isRec ? { color: '#FDE68A' } : {}) }}>
                        {d.item_name}
                      </span>
                      <span style={styles.itemPrice}>${parseFloat(d.base_price).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Queue */}
        <div style={styles.queueSection}>
          <h2 style={styles.queueTitle}>📋 Order Status</h2>
          {activeQueue.length === 0 ? (
            <p style={styles.queueEmpty}>No active orders</p>
          ) : (
            <div style={styles.queueList}>
              {activeQueue.map(order => (
                <div key={order.order_id} style={{
                  ...styles.queueCard,
                  borderColor: STATUS_COLORS[order.status] || '#F59E0B',
                  background:  order.status === 'ready' ? '#0F3D1A' : '#1A0F2E',
                }}>
                  <div style={styles.queueOrderNum}>#{order.order_id}</div>
                  <div style={{ ...styles.queueStatus, color: STATUS_COLORS[order.status] || '#F59E0B' }}>
                    {STATUS_LABEL[order.status] || order.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span>Customize your drink — ask for add-ons at the counter</span>
      </div>
    </div>
  );
}

const styles = {
  bg:           { height: '100vh', background: '#0D0818', color: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '2px solid #3D2B52', flexShrink: 0 },
  logo:         { fontSize: '36px', fontWeight: 900, color: '#F472B6', margin: 0 },
  tagline:      { color: '#B09CC8', fontSize: '16px', marginTop: '2px' },
  clock:        { fontSize: '36px', fontWeight: 700, color: '#9B6FD0' },
  weatherBadge: { fontSize: '14px', color: '#B09CC8', fontWeight: 600 },
  body:         { display: 'flex', flex: 1, overflow: 'hidden' },
  menuSection:  { flex: 1, overflow: 'hidden', padding: '20px 32px' },
  scrollWrapper:{ height: '100%', overflow: 'hidden', position: 'relative' },
  scrollInner:  { height: '100%', overflowY: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none' },
  menuGrid:     { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', paddingBottom: '10px' },
  menuItem:     { background: '#1A0F2E', border: '1px solid #3D2B52', borderRadius: '12px', padding: '12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center', position: 'relative' },
  recItem:      { border: '2px solid #F59E0B', background: '#2A1F0A', boxShadow: '0 0 16px rgba(245,158,11,0.3)' },
  recBadge:     { background: '#F59E0B', color: '#000', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '99px', marginBottom: '2px' },
  itemImage:    { width: '100%', height: '120px', objectFit: 'contain', borderRadius: '12px', background: '#0F0B1D' },
  itemName:     { fontWeight: 700, fontSize: '14px', color: 'white' },
  itemPrice:    { fontWeight: 900, fontSize: '18px', color: '#F472B6' },
  queueSection: { width: '260px', background: '#12091F', borderLeft: '2px solid #3D2B52', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flexShrink: 0 },
  queueTitle:   { fontSize: '18px', fontWeight: 800, color: 'white', margin: 0 },
  queueEmpty:   { color: '#B09CC8', fontSize: '14px' },
  queueList:    { display: 'flex', flexDirection: 'column', gap: '10px' },
  queueCard:    { border: '2px solid', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '4px' },
  queueOrderNum:{ fontSize: '20px', fontWeight: 900, color: 'white' },
  queueStatus:  { fontSize: '13px', fontWeight: 700 },
  footer:       { padding: '12px 48px', background: '#6B3FA0', textAlign: 'center', fontSize: '16px', fontWeight: 600, flexShrink: 0 },
  backBtn:      { background: '#1A0F2E', border: '1px solid #3D2B52', color: 'white', borderRadius: '10px', padding: '10px 16px', fontWeight: 600, cursor: 'pointer' },
};