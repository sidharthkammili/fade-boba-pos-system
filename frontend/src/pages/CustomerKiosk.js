import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAddons, fetchDrinks, placeOrder, translateTexts } from '../api/api';
import ReceiptModal from '../components/ReceiptModal';
import ChatbotWidget from '../components/ChatbotWidget';

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

const KIOSK_EMPLOYEE_ID = 1;
const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=30.628&longitude=-96.3344&current_weather=true&temperature_unit=fahrenheit';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'zh-CN', label: '中文' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'ko', label: '한국어' },
];

const DEFAULT_TEXT = {
  home: '← Home',
  history: 'History',
  cart: 'Cart',
  favorites: 'Your Favorites',
  fullMenu: 'Full Menu',
  recentOrders: 'Your Recent Orders',
  noPreviousOrders: 'No previous orders found.',
  reorderAll: 'Reorder All Items',
  yourOrder: 'Your Order',
  cartEmpty: 'Your cart is empty.',
  remove: 'Remove',
  total: 'Total',
  placeOrder: 'Place Order',
  backToMenu: '← Back to Menu',
  orderPlaced: 'Order Placed!',
  waitForName: 'Please wait for your name to be called.',
  viewReceipt: 'View Digital Receipt',
  startNewOrder: 'Start New Order',
  iceLevel: 'Ice Level',
  sugarLevel: 'Sugar Level',
  addons: 'Add-ons',
  cancel: 'Cancel',
  addToCart: 'Add to Cart',
  language: 'Language',
  translating: 'Translating menu…',
  hotSuggestion: 'Hot outside! Cool down with a Strawberry Slush or Dragonfruit Slush',
  warmSuggestion: 'Nice weather! Try our Brown Sugar Boba or Matcha Latte',
  coolSuggestion: 'A little cool — our Thai Milk Tea or Rose Milk Tea will warm you up',
  coldSuggestion: 'Cold out there! Our Brewed Black Tea or Classic Milk Tea is perfect',
  size: 'Size',
  temperature: 'Temperature',
  hot: 'Hot',
  iced: 'Iced',
  quantity: 'Quantity',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  edit: 'Edit',
  updateCart: 'Update Cart',
};

const getDrinkImage = (itemName) => {
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

function getDrinkSuggestion(tempF, text) {
  if (tempF >= 85) return text.hotSuggestion;
  if (tempF >= 70) return text.warmSuggestion;
  if (tempF >= 55) return text.coolSuggestion;
  return text.coldSuggestion;
}

function getRecommendedDrink(tempF) {
  if (tempF >= 85) return 'Strawberry Slush';
  if (tempF >= 70) return 'Brown Sugar Boba';
  if (tempF >= 55) return 'Thai Milk Tea';
  return 'Classic Milk Tea';
}

function sortDrinks(drinks, recommendedName) {
  return [...drinks].sort((a, b) => {
    if (a.item_name === recommendedName) return -1;
    if (b.item_name === recommendedName) return 1;
    return 0;
  });
}

function getDrinkCategory(drink) {
  if (drink.is_seasonal) return 'Seasonal & Promotional';
  const name = (drink.item_name || '').toLowerCase();
  if (name.includes('milk tea')) return 'Milk Tea';
  if (name.includes('fruit tea')) return 'Fruit Tea';
  if (name.includes('smoothie')) return 'Smoothie';
  if (name.includes('slush')) return 'Slush';
  if (name.includes('brewed')) return 'Brewed Tea';
  return 'Specialty Drinks';
}

function canBeHot(drink) {
  const category = getDrinkCategory(drink);
  return category !== 'Slush' && category !== 'Smoothie';
}

function getSizeLabel(size, text) {
  if (size === 'small') return text.small;
  if (size === 'large') return text.large;
  return text.medium;
}

function getSizePriceAdjustment(size) {
  if (size === 'small') return -1.0;
  if (size === 'large') return 1.0;
  return 0.0;
}

function getSizeAdjustmentLabel(size) {
  if (size === 'small') return '- $1.00';
  if (size === 'large') return '+ $1.00';
  return '';
}

function getTemperatureLabel(value, text) {
  return value === 'hot' ? text.hot : text.iced;
}

const CATEGORIES = [
  'All',
  'Milk Tea',
  'Fruit Tea',
  'Smoothie',
  'Slush',
  'Specialty Drinks',
  'Brewed Tea',
  'Seasonal & Promotional',
];

function getFocusableElements(container) {
  if (!container) return [];

  return Array.from(
    container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

export default function CustomerKiosk() {
  const [drinks, setDrinks] = useState([]);
  const [recommended, setRecommended] = useState(null);
  const [addons, setAddons] = useState([]);
  const [cart, setCart] = useState([]);
  const [modal, setModal] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [iceLevel, setIceLevel] = useState('Regular Ice');
  const [sugarLevel, setSugarLevel] = useState('Regular Sugar');
  const [selectedSize, setSelectedSize] = useState('medium');
  const [temperature, setTemperature] = useState('iced');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [screen, setScreen] = useState('menu');
  const [orderId, setOrderId] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [lastCompletedOrder, setLastCompletedOrder] = useState(null);
  const [weather, setWeather] = useState(null);
  const [language] = useState(() => localStorage.getItem('boba_language') || 'en');
  const [uiText, setUiText] = useState(DEFAULT_TEXT);
  const [translatedNames, setTranslatedNames] = useState({ drinks: {}, addons: {} });
  const [isTranslating, setIsTranslating] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [editingCartIndex, setEditingCartIndex] = useState(null);

  const navigate = useNavigate();
  const modalRef = useRef(null);
  const modalCancelRef = useRef(null);
  const lastTriggerRef = useRef(null);

  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem('boba_favorites') || '[]')
  );
  const [history, setHistory] = useState(() =>
    JSON.parse(localStorage.getItem('boba_history') || '[]')
  );
  const [customerUser, setCustomerUser] = useState(() => {
    const userType = sessionStorage.getItem('userType');
    if (userType !== 'customer') return null;
    try {
      return JSON.parse(sessionStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('boba_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('boba_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    fetchDrinks().then((data) => setDrinks(Array.isArray(data) ? data : []));
    fetchAddons().then((data) => setAddons(Array.isArray(data) ? data : []));

    fetch(WEATHER_URL)
      .then((response) => response.json())
      .then((data) => {
        const current = data.current_weather;
        if (!current) return;
        const temp = Math.round(current.temperature);
        setWeather({
          temp,
          code: current.weathercode,
          wind: Math.round(current.windspeed),
        });
        setRecommended(getRecommendedDrink(temp));
      })
      .catch(() => setWeather(null));
  }, []);

  useEffect(() => {
    const runTranslation = async () => {
      if (language === 'en' || drinks.length === 0) {
        setUiText(DEFAULT_TEXT);
        setTranslatedNames({ drinks: {}, addons: {} });
        return;
      }

      setIsTranslating(true);
      try {
        const uiValues = Object.values(DEFAULT_TEXT);
        const drinkNames = drinks.map((drink) => drink.item_name);
        const addonNames = addons.map((addon) => addon.item_name);
        const translated = await translateTexts(
          [...uiValues, ...drinkNames, ...addonNames],
          language
        );

        const nextUiText = {};
        Object.keys(DEFAULT_TEXT).forEach((key, index) => {
          nextUiText[key] = translated[index] || DEFAULT_TEXT[key];
        });

        const translatedDrinkMap = {};
        const translatedAddonMap = {};
        let cursor = uiValues.length;

        drinks.forEach((drink) => {
          translatedDrinkMap[drink.menu_item_id] = translated[cursor] || drink.item_name;
          cursor += 1;
        });

        addons.forEach((addon) => {
          translatedAddonMap[addon.menu_item_id] = translated[cursor] || addon.item_name;
          cursor += 1;
        });

        setUiText(nextUiText);
        setTranslatedNames({ drinks: translatedDrinkMap, addons: translatedAddonMap });
      } catch (error) {
        console.error('Translation failed:', error);
        setUiText(DEFAULT_TEXT);
        setTranslatedNames({ drinks: {}, addons: {} });
      } finally {
        setIsTranslating(false);
      }
    };

    runTranslation();
  }, [language, drinks, addons]);

  useEffect(() => {
    if (!modal) return;

    const focusTimer = window.setTimeout(() => {
      modalCancelRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, [modal]);

  const favoriteDrinks = useMemo(
    () => drinks.filter((drink) => favorites.includes(drink.menu_item_id)),
    [drinks, favorites]
  );

  const sortedDrinks = recommended ? sortDrinks(drinks, recommended) : drinks;

  const displayedDrinks = useMemo(() => {
    if (selectedCategory === 'All') return sortedDrinks;
    return sortedDrinks.filter((drink) => getDrinkCategory(drink) === selectedCategory);
  }, [sortedDrinks, selectedCategory]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + parseFloat(item.sale_price || 0), 0),
    [cart]
  );

  const modalUnitPrice = useMemo(() => {
    if (!modal) return 0;
    const addonTotal = selectedAddons.reduce(
      (sum, addon) => sum + parseFloat(addon.base_price),
      0
    );
    const sizeAdjustment = getSizePriceAdjustment(selectedSize);
    return parseFloat(modal.base_price) + addonTotal + sizeAdjustment;
  }, [modal, selectedAddons, selectedSize]);

  const modalPreviewTotal = useMemo(
    () => modalUnitPrice * selectedQuantity,
    [modalUnitPrice, selectedQuantity]
  );

  const getDrinkName = (drink) => translatedNames.drinks[drink.menu_item_id] || drink.item_name;
  const getAddonName = (addon) => translatedNames.addons[addon.menu_item_id] || addon.item_name;

  const closeModal = () => {
    setModal(null);
    setEditingCartIndex(null);
    window.setTimeout(() => {
      lastTriggerRef.current?.focus?.();
    }, 0);
  };

  const handleCustomerLogin = () => {
    navigate('/login?customer=1');
  };

  const handleCustomerLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userType');
    setCustomerUser(null);
    setAnnouncement('Customer logged out.');
    setScreen('menu');
  };

  const openDrink = (drink, triggerElement) => {
    lastTriggerRef.current = triggerElement || document.activeElement;
    setEditingCartIndex(null);
    setModal(drink);
    setSelectedAddons([]);
    setIceLevel('Regular Ice');
    setSugarLevel('Regular Sugar');
    setSelectedSize('medium');
    setTemperature('iced');
    setSelectedQuantity(1);
  };

  const handleModalKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = getFocusableElements(modalRef.current);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const toggleAddon = (addon) => {
    const isAlreadySelected = selectedAddons.some(
      (item) => item.menu_item_id === addon.menu_item_id
    );

    setSelectedAddons((prev) =>
      isAlreadySelected
        ? prev.filter((item) => item.menu_item_id !== addon.menu_item_id)
        : [...prev, addon]
    );

    setAnnouncement(
      isAlreadySelected
        ? `${getAddonName(addon)} removed from add-ons.`
        : `${getAddonName(addon)} added to add-ons.`
    );
  };

  const toggleFavorite = (drinkId) => {
    const drink = drinks.find((item) => item.menu_item_id === drinkId);
    const alreadyFavorite = favorites.includes(drinkId);

    setFavorites((prev) =>
      alreadyFavorite ? prev.filter((id) => id !== drinkId) : [...prev, drinkId]
    );

    if (drink) {
      setAnnouncement(
        alreadyFavorite
          ? `${getDrinkName(drink)} removed from favorites.`
          : `${getDrinkName(drink)} added to favorites.`
      );
    }
  };

  const addToCart = () => {
    if (!modal) return;

    const lineTotal = modalUnitPrice * selectedQuantity;

    const newItem = {
      ...modal,
      unit_price: modalUnitPrice,
      sale_price: lineTotal,
      quantity: selectedQuantity,
      size: selectedSize,
      sizeAdjustment: getSizePriceAdjustment(selectedSize),
      temperature,
      addons: selectedAddons,
      ice: temperature === 'hot' ? 'N/A' : iceLevel,
      sugar: sugarLevel,
    };

    if (editingCartIndex !== null) {
      setCart((prev) => {
        const nextCart = [...prev];
        nextCart[editingCartIndex] = newItem;
        return nextCart;
      });
      setAnnouncement(`Updated ${selectedQuantity} ${getDrinkName(modal)} in cart.`);
      setEditingCartIndex(null);
    } else {
      setCart((prev) => [...prev, newItem]);
      setAnnouncement(`${selectedQuantity} ${getDrinkName(modal)} added to cart.`);
    }

    closeModal();
  };

  const removeCartItem = (index, itemName) => {
    setCart((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    setAnnouncement(`${itemName} removed from cart.`);
  };

  const editCartItem = (index) => {
    const item = cart[index];
    setEditingCartIndex(index);
    setModal(item);
    setSelectedAddons(item.addons || []);
    setIceLevel(item.ice || 'Regular Ice');
    setSugarLevel(item.sugar || 'Regular Sugar');
    setSelectedSize(item.size || 'medium');
    setTemperature(item.temperature || 'iced');
    setSelectedQuantity(item.quantity || 1);
  };

  const updateCartQuantity = (index, delta) => {
    setCart((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        const currentQuantity = item.quantity || 1;
        const nextQuantity = Math.max(1, currentQuantity + delta);
        const unitPrice =
          parseFloat(item.unit_price || 0) ||
          parseFloat(item.sale_price || 0) / currentQuantity;

        return {
          ...item,
          quantity: nextQuantity,
          unit_price: unitPrice,
          sale_price: unitPrice * nextQuantity,
        };
      })
    );
  };

  const submitOrder = async () => {
    const items = cart.map((item) => ({
      menu_item_id: item.menu_item_id,
      sale_price: item.sale_price,
      quantity: item.quantity || 1,
      ice: item.ice,
      sugar: item.sugar,
      size: item.size,
      temperature: item.temperature,
      addons: item.addons.map((addon) => ({
        add_on_menu_item_id: addon.menu_item_id,
        quantity: item.quantity || 1,
      })),
    }));

    const response = await placeOrder(KIOSK_EMPLOYEE_ID, items);
    setOrderId(response.order_id);

    const completedOrder = {
      orderId: response.order_id,
      date: new Date().toLocaleString(),
      items: [...cart],
      total,
    };

    setHistory((prev) => [completedOrder, ...prev].slice(0, 10));
    setLastCompletedOrder(completedOrder);
    setCart([]);
    setAnnouncement(`Order ${response.order_id} placed successfully.`);
    setScreen('confirm');
  };

  if (screen === 'confirm') {
    return (
      <main style={styles.confirmScreen} id="main-content" aria-label="Order confirmation">
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>

        <div style={styles.confirmBox}>
          <div style={{ fontSize: '4rem' }} aria-hidden="true"></div>
          <h1 style={{ fontSize: '2rem', color: 'var(--green)' }}>{uiText.orderPlaced}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Order #{orderId}</p>
          <p style={{ color: 'var(--text-muted)' }}>{uiText.waitForName}</p>
          <button
            style={{
              ...styles.bigBtn,
              background: 'var(--purple)',
              marginBottom: '12px',
              marginTop: '12px',
            }}
            onClick={() =>
              setReceiptData({
                orderId,
                items: lastCompletedOrder?.items || history[0]?.items || [],
                total: lastCompletedOrder?.total || history[0]?.total || 0,
                date: lastCompletedOrder?.date || history[0]?.date,
              })
            }
            aria-label={uiText.viewReceipt}
          >
            {uiText.viewReceipt}
          </button>
          <button
            style={{ ...styles.bigBtn, background: 'var(--border)' }}
            onClick={() => {
              setAnnouncement('Starting a new order.');
              setScreen('menu');
            }}
          >
            {uiText.startNewOrder}
          </button>
        </div>
        {receiptData && <ReceiptModal order={receiptData} onClose={() => setReceiptData(null)} />}
        <ChatbotWidget />
      </main>
    );
  }

  return (
    <main style={styles.layout} id="main-content">
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <header style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')} aria-label="Return to portal">
          {uiText.home}
        </button>

        <div>
          <h1 style={styles.logo}>Fade Boba</h1>
          {isTranslating && (
            <p style={styles.translatingText} aria-live="polite">
              {uiText.translating}
            </p>
          )}
        </div>

        <div style={styles.headerControls}>
          {weather && (
            <div
              style={styles.weatherBox}
              aria-label={`Current weather ${weather.temp} degrees Fahrenheit with wind ${weather.wind} miles per hour`}
            >
              <span style={{ fontSize: '1.75rem' }} aria-hidden="true">
                {getWeatherEmoji(weather.code)}
              </span>
              <div style={styles.weatherText}>
                <span style={styles.weatherTemp}>{weather.temp}°F</span>
                <span style={styles.weatherWind}>💨 {weather.wind} mph</span>
              </div>
            </div>
          )}

          <div style={styles.customerLoginSection}>
            {customerUser ? (
              <div style={styles.customerInfo}>
                <span style={styles.customerName}>Hi, {customerUser.first_name}</span>
                <button style={styles.logoutBtn} onClick={handleCustomerLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <button style={styles.loginBtn} onClick={handleCustomerLogin}>
                Customer Login
              </button>
            )}
          </div>

          <div style={styles.navButtons}>
            <button
              style={styles.navToggle}
              onClick={() => {
                setAnnouncement('Viewing order history.');
                setScreen('history');
              }}
            >
              {uiText.history}
            </button>
            <button
              style={styles.cartToggle}
              onClick={() => {
                const nextScreen = screen === 'cart' ? 'menu' : 'cart';
                setAnnouncement(nextScreen === 'cart' ? 'Viewing cart.' : 'Returning to menu.');
                setScreen(nextScreen);
              }}
              aria-label={`${uiText.cart}. ${cart.length} items.`}
            >
              🛒 {uiText.cart} ({cart.length})
            </button>
          </div>
        </div>
      </header>

      {weather && screen === 'menu' && (
        <div style={styles.suggestionBanner} role="status" aria-live="polite">
          {getDrinkSuggestion(weather.temp, uiText)}
        </div>
      )}

      {screen === 'menu' && (
        <section style={styles.menuContainer} aria-label="Drink menu">
          {favoriteDrinks.length > 0 && (
            <>
              <h2 style={styles.sectionTitle}>{uiText.favorites}</h2>
              <div style={styles.menuGrid}>
                {favoriteDrinks.map((drink) => (
                  <div key={`favorite-${drink.menu_item_id}`} style={styles.drinkCardWrap}>
                    <button
                      style={styles.drinkCard}
                      onClick={(event) => openDrink(drink, event.currentTarget)}
                      aria-label={`${getDrinkName(drink)}. ${parseFloat(
                        drink.base_price
                      ).toFixed(2)} dollars.`}
                    >
                      <img
                        src={getDrinkImage(drink.item_name)}
                        alt={getDrinkName(drink)}
                        style={styles.drinkImage}
                        loading="lazy"
                      />
                      <span style={styles.drinkName}>{getDrinkName(drink)}</span>
                      <span style={styles.drinkPrice}>
                        ${parseFloat(drink.base_price).toFixed(2)}
                      </span>
                    </button>
                    <button
                      type="button"
                      style={styles.favoriteButton}
                      onClick={() => toggleFavorite(drink.menu_item_id)}
                      aria-label={`Remove ${getDrinkName(drink)} from favorites`}
                    >
                      ❤️
                    </button>
                  </div>
                ))}
              </div>
              <h2 style={styles.sectionTitle}>{uiText.fullMenu}</h2>
            </>
          )}

          <div style={styles.tabsContainer}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                style={{
                  ...styles.tabButton,
                  ...(selectedCategory === cat ? styles.activeTab : {}),
                }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={styles.menuGrid}>
            {displayedDrinks.map((drink) => {
              const isFavorite = favorites.includes(drink.menu_item_id);
              const isRec = drink.item_name === recommended;
              return (
                <div
                  key={drink.menu_item_id}
                  style={{
                    ...styles.drinkCardWrap,
                    ...(isRec ? { filter: 'drop-shadow(0 0 12px rgba(245,158,11,0.5))' } : {}),
                  }}
                >
                  <button
                    style={{
                      ...styles.drinkCard,
                      ...(isRec ? { border: '2px solid #F59E0B', background: '#2A1F0A' } : {}),
                    }}
                    onClick={(event) => openDrink(drink, event.currentTarget)}
                    aria-label={`${getDrinkName(drink)}. ${parseFloat(
                      drink.base_price
                    ).toFixed(2)} dollars.${isRec ? ' Weather recommended drink.' : ''}`}
                  >
                    {isRec && <div style={styles.recBadge}>Weather Pick</div>}
                    <img
                      src={getDrinkImage(drink.item_name)}
                      alt={getDrinkName(drink)}
                      style={styles.drinkImage}
                      loading="lazy"
                    />
                    <span style={styles.drinkName}>{getDrinkName(drink)}</span>
                    <span style={styles.drinkPrice}>
                      ${parseFloat(drink.base_price).toFixed(2)}
                    </span>
                  </button>
                  <button
                    type="button"
                    style={styles.favoriteButton}
                    onClick={() => toggleFavorite(drink.menu_item_id)}
                    aria-label={`${isFavorite ? 'Remove' : 'Add'} ${getDrinkName(drink)} ${
                      isFavorite ? 'from' : 'to'
                    } favorites`}
                  >
                    {isFavorite ? '❤️' : '🤍'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {screen === 'history' && (
        <section style={styles.cartView} aria-label="Order history">
          <h2 style={{ marginBottom: '20px' }}>{uiText.recentOrders}</h2>
          {history.length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>{uiText.noPreviousOrders}</p>
          )}
          {history.map((order, index) => (
            <article
              key={`${order.orderId}-${index}`}
              style={{ ...styles.cartRow, flexDirection: 'column', alignItems: 'flex-start' }}
            >
              <div style={styles.historyHeaderRow}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  Order #{order.orderId}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>{order.date}</span>
              </div>
              {order.items.map((item, itemIndex) => (
                <div key={`${item.menu_item_id}-${itemIndex}`} style={styles.historyItem}>
                  <div style={{ fontWeight: 600 }}>
                    {item.item_name} × {item.quantity || 1}{' '}
                    <span style={{ color: 'var(--pink)' }}>
                      ${parseFloat(item.sale_price || 0).toFixed(2)}
                    </span>
                  </div>
                  <div style={styles.historyMeta}>
                    Size: {getSizeLabel(item.size || 'medium', uiText)}
                    {item.size && item.size !== 'medium' ? ` (${getSizeAdjustmentLabel(item.size)})` : ''} | Temp:{' '}
                    {getTemperatureLabel(item.temperature || 'iced', uiText)} | Ice: {item.ice} | Sugar:{' '}
                    {item.sugar}
                  </div>
                  {item.addons.map((addon) => (
                    <div key={addon.menu_item_id} style={styles.historyMeta}>
                      + {addon.item_name}
                    </div>
                  ))}
                </div>
              ))}
              <div style={styles.historyFooterRow}>
                <span style={{ fontWeight: 700 }}>
                  {uiText.total}: ${parseFloat(order.total).toFixed(2)}
                </span>
                <button
                  style={{ ...styles.removeBtn, background: 'var(--purple)' }}
                  onClick={() => {
                    setCart((prev) => [...prev, ...order.items]);
                    setAnnouncement(`Items from order ${order.orderId} added to cart.`);
                    setScreen('cart');
                  }}
                >
                  {uiText.reorderAll}
                </button>
              </div>
            </article>
          ))}
          <button
            style={{ ...styles.bigBtn, background: 'var(--border)', marginTop: '24px' }}
            onClick={() => setScreen('menu')}
          >
            {uiText.backToMenu}
          </button>
        </section>
      )}

      {screen === 'cart' && (
        <section style={styles.cartView} aria-label="Shopping cart">
          <h2 style={{ marginBottom: '20px' }}>{uiText.yourOrder}</h2>
          {cart.length === 0 && <p style={{ color: 'var(--text-muted)' }}>{uiText.cartEmpty}</p>}
          {cart.map((item, index) => (
            <article key={`${item.menu_item_id}-${index}`} style={styles.cartRow}>
              <div style={styles.cartInfoBlock}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {item.item_name} × {item.quantity || 1}
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  Size: {getSizeLabel(item.size || 'medium', uiText)}
                  {item.size && item.size !== 'medium' ? ` (${getSizeAdjustmentLabel(item.size)})` : ''} | Temp:{' '}
                  {getTemperatureLabel(item.temperature || 'iced', uiText)} | Ice: {item.ice} | Sugar:{' '}
                  {item.sugar}
                </div>
                {item.addons.map((addon) => (
                  <div key={addon.menu_item_id} style={{ color: 'var(--text-muted)' }}>
                    + {addon.item_name}
                  </div>
                ))}
                <div style={styles.cartQuantityRow}>
                  <button
                    style={styles.cartQtyButton}
                    onClick={() => updateCartQuantity(index, -1)}
                    aria-label={`Decrease quantity for ${item.item_name}`}
                  >
                    −
                  </button>
                  <span style={styles.cartQtyValue}>{item.quantity || 1}</span>
                  <button
                    style={styles.cartQtyButton}
                    onClick={() => updateCartQuantity(index, 1)}
                    aria-label={`Increase quantity for ${item.item_name}`}
                  >
                    +
                  </button>
                </div>
              </div>
              <div style={styles.cartRowActions}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--pink)' }}>
                  ${parseFloat(item.sale_price || 0).toFixed(2)}
                </span>
                <button
                  style={{ ...styles.removeBtn, background: 'var(--green)' }}
                  onClick={() => editCartItem(index)}
                >
                  {uiText.edit}
                </button>
                <button
                  style={styles.removeBtn}
                  onClick={() => removeCartItem(index, item.item_name)}
                >
                  {uiText.remove}
                </button>
              </div>
            </article>
          ))}
          {cart.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '1rem', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span>Tax (8.25%)</span>
              <span>${(total * 0.0825).toFixed(2)}</span>
            </div>
            <div style={styles.totalRow} aria-label={`${uiText.total} ${(total * 1.0825).toFixed(2)} dollars`}>
              <span style={{ fontSize: '1.4rem' }}>{uiText.total}</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--pink)' }}>
                ${(total * 1.0825).toFixed(2)}
              </span>
            </div>
              <button style={styles.bigBtn} onClick={() => { setPaymentMethod(null); setShowPayment(true); }}>
                {uiText.placeOrder}
              </button>
            </div>
          )}
          <button
            style={{ ...styles.bigBtn, background: 'var(--border)', marginTop: '12px' }}
            onClick={() => setScreen('menu')}
          >
            {uiText.backToMenu}
          </button>
        </section>
      )}
      {showPayment && (
        <div style={styles.overlay}>
          <div style={styles.modalBox}>
            <h2 style={{ marginBottom: '16px' }}>Select Payment Method</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[{ label: 'Cash', icon: '💵' }, { label: 'Credit / Debit', icon: '💳' }, { label: 'Apple Pay', icon: '🍎' }].map(({ label, icon }) => (
                <button
                  key={label}
                  style={{
                    ...styles.bigBtn,
                    background: paymentMethod === label ? 'var(--green)' : 'var(--border)',
                    color: paymentMethod === label ? '#000' : 'var(--text)',
                    fontSize: '1.1rem',
                  }}
                  onClick={() => setPaymentMethod(label)}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button style={{ ...styles.bigBtn, flex: 1, background: 'var(--border)' }} onClick={() => { setShowPayment(false); setPaymentMethod(null); }}>
                Cancel
              </button>
              <button
                style={{ ...styles.bigBtn, flex: 2, opacity: paymentMethod ? 1 : 0.4 }}
                disabled={!paymentMethod}
                onClick={() => { setShowPayment(false); submitOrder(); }}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
      {modal && (
        <div style={styles.overlay} role="dialog" aria-modal="true" aria-label={getDrinkName(modal)}>
          <div
            ref={modalRef}
            style={styles.modalBox}
            onKeyDown={handleModalKeyDown}
            aria-describedby="customization-help"
          >
            <p id="customization-help" className="sr-only">
              Use Tab to move through customization options. Press Escape to close this dialog.
            </p>

            <h2 style={{ marginBottom: '8px' }}>{getDrinkName(modal)}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '1.1rem' }}>
              ${modalPreviewTotal.toFixed(2)}
            </p>

            <p style={styles.modalLabel}>{uiText.size}:</p>
            <div style={styles.levelGroup} role="group" aria-label={uiText.size}>
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  style={{
                    ...styles.levelBtn,
                    background: selectedSize === size ? 'var(--purple)' : 'var(--border)',
                  }}
                  aria-pressed={selectedSize === size}
                  onClick={() => setSelectedSize(size)}
                >
                  {getSizeLabel(size, uiText)}
                </button>
              ))}
            </div>

            {selectedSize !== 'medium' && (
              <div style={styles.sizeAdjustmentText}>
                Size adjustment: {getSizeAdjustmentLabel(selectedSize)}
              </div>
            )}

            {canBeHot(modal) && (
              <>
                <p style={{ ...styles.modalLabel, marginTop: '16px' }}>{uiText.temperature}:</p>
                <div style={styles.levelGroup} role="group" aria-label={uiText.temperature}>
                  {['iced', 'hot'].map((temp) => (
                    <button
                      key={temp}
                      style={{
                        ...styles.levelBtn,
                        background: temperature === temp ? 'var(--purple)' : 'var(--border)',
                      }}
                      aria-pressed={temperature === temp}
                      onClick={() => setTemperature(temp)}
                    >
                      {getTemperatureLabel(temp, uiText)}
                    </button>
                  ))}
                </div>
              </>
            )}

            <p style={{ ...styles.modalLabel, marginTop: '16px' }}>{uiText.quantity}:</p>
            <div style={styles.quantityRow} role="group" aria-label={uiText.quantity}>
              <button
                style={styles.quantityButton}
                onClick={() => setSelectedQuantity((prev) => Math.max(1, prev - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span style={styles.quantityValue}>{selectedQuantity}</span>
              <button
                style={styles.quantityButton}
                onClick={() => setSelectedQuantity((prev) => prev + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {temperature !== 'hot' && (
              <>
                <p style={{ ...styles.modalLabel, marginTop: '16px' }}>{uiText.iceLevel}:</p>
                <div style={styles.levelGroup} role="group" aria-label={uiText.iceLevel}>
                  {['No Ice', 'Less Ice', 'Regular Ice', 'Extra Ice'].map((level) => (
                    <button
                      key={`ice-${level}`}
                      style={{
                        ...styles.levelBtn,
                        background: iceLevel === level ? '#3b82f6' : 'var(--border)',
                      }}
                      aria-pressed={iceLevel === level}
                      onClick={() => setIceLevel(level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </>
            )}

            <p style={{ ...styles.modalLabel, marginTop: '16px' }}>{uiText.sugarLevel}:</p>
            <div style={styles.levelGroup} role="group" aria-label={uiText.sugarLevel}>
              {['No Sugar', 'Less Sugar', 'Regular Sugar', 'Extra Sugar'].map((level) => (
                <button
                  key={`sugar-${level}`}
                  style={{
                    ...styles.levelBtn,
                    background: sugarLevel === level ? 'var(--pink)' : 'var(--border)',
                  }}
                  aria-pressed={sugarLevel === level}
                  onClick={() => setSugarLevel(level)}
                >
                  {level}
                </button>
              ))}
            </div>

            <p style={{ ...styles.modalLabel, marginTop: '16px' }}>{uiText.addons}:</p>
            <div style={styles.addonGrid} role="group" aria-label={uiText.addons}>
              {addons.map((addon) => {
                const selected = !!selectedAddons.find(
                  (item) => item.menu_item_id === addon.menu_item_id
                );
                return (
                  <button
                    key={addon.menu_item_id}
                    style={{
                      ...styles.addonBtn,
                      background: selected ? 'var(--purple)' : 'var(--border)',
                    }}
                    aria-pressed={selected}
                    onClick={() => toggleAddon(addon)}
                  >
                    {getAddonName(addon)}
                    <br />+${parseFloat(addon.base_price).toFixed(2)}
                  </button>
                );
              })}
            </div>

            <div style={styles.modalFooter}>
              <button
                ref={modalCancelRef}
                style={{ ...styles.bigBtn, flex: 1, background: 'var(--border)' }}
                onClick={closeModal}
              >
                {uiText.cancel}
              </button>
              <button style={{ ...styles.bigBtn, flex: 2 }} onClick={addToCart}>
                {editingCartIndex !== null ? uiText.updateCart : uiText.addToCart}
              </button>
            </div>
          </div>
        </div>
      )}

      <ChatbotWidget />
    </main>
  );
}

const styles = {
  layout: {
    minHeight: '100vh',
    background: 'var(--dark)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 32px',
    background: 'var(--dark-card)',
    borderBottom: '1px solid var(--border)',
    flexWrap: 'wrap',
    gap: '12px',
  },
  headerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  navButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  logo: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: 'var(--pink)',
  },
  translatingText: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  weatherBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'var(--dark)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '10px 16px',
  },
  weatherText: {
    display: 'flex',
    flexDirection: 'column',
  },
  weatherTemp: {
    fontWeight: 800,
    fontSize: '1.15rem',
    color: 'var(--text)',
  },
  weatherWind: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
  },
  suggestionBanner: {
    background: 'var(--purple)',
    color: 'white',
    padding: '12px 32px',
    fontSize: '1rem',
    fontWeight: 600,
    textAlign: 'center',
    marginTop: '20px',
  },
  cartToggle: {
    background: 'var(--purple)',
    color: 'white',
    borderRadius: '12px',
    padding: '14px 24px',
    fontSize: '1rem',
    fontWeight: 700,
  },
  navToggle: {
    background: 'var(--dark)',
    border: '1px solid var(--border)',
    color: 'white',
    borderRadius: '12px',
    padding: '14px 24px',
    fontSize: '1rem',
    fontWeight: 700,
  },
  loginBtn: {
    background: 'var(--purple)',
    color: 'white',
    borderRadius: '12px',
    padding: '12px 20px',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  logoutBtn: {
    background: 'var(--border)',
    color: 'var(--text)',
    borderRadius: '12px',
    padding: '10px 16px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  customerLoginSection: {
    display: 'flex',
    alignItems: 'center',
  },
  customerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  customerName: {
    color: 'var(--text)',
    fontWeight: 700,
  },
  menuContainer: {
    padding: '32px',
  },
  sectionTitle: {
    marginBottom: '20px',
    color: 'var(--text)',
    fontSize: '1.5rem',
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  drinkCardWrap: {
    position: 'relative',
  },
  drinkCard: {
    width: '100%',
    background: 'var(--dark-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    minHeight: '180px',
    color: 'var(--text)',
  },
  favoriteButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'rgba(26, 16, 37, 0.85)',
    padding: '6px 10px',
    borderRadius: '999px',
  },
  drinkImage: {
    width: '200px',
    height: '200px',
    objectFit: 'contain',
  },
  sizeAdjustmentText: {
    marginTop: '10px',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  drinkName: {
    fontWeight: 700,
    fontSize: '1rem',
    textAlign: 'center',
  },
  drinkPrice: {
    color: 'var(--pink)',
    fontWeight: 800,
    fontSize: '1.25rem',
  },
  cartView: {
    padding: '32px',
    maxWidth: '760px',
    margin: '0 auto',
    width: '100%',
  },
  cartRow: {
    background: 'var(--dark-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },
  cartInfoBlock: {
    flex: 1,
    minWidth: 0,
  },
  cartRowActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  cartQuantityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '10px',
  },
  cartQtyButton: {
    background: 'var(--purple)',
    color: 'white',
    borderRadius: '8px',
    minWidth: '36px',
    minHeight: '36px',
    fontSize: '1.1rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartQtyValue: {
    minWidth: '24px',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '1rem',
  },
  removeBtn: {
    background: 'var(--red)',
    color: 'white',
    borderRadius: '8px',
    padding: '8px 14px',
    fontWeight: 600,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px 0',
    borderTop: '1px solid var(--border)',
    marginBottom: '16px',
  },
  bigBtn: {
    background: 'var(--purple)',
    color: 'white',
    borderRadius: '12px',
    padding: '18px',
    fontSize: '1rem',
    fontWeight: 700,
    width: '100%',
  },
  confirmScreen: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--dark)',
    padding: '24px',
  },
  confirmBox: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'center',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
    padding: '20px',
  },
  modalBox: {
    background: 'var(--dark-card)',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    padding: '36px',
    width: '480px',
    maxWidth: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalLabel: {
    fontWeight: 700,
    marginBottom: '6px',
    fontSize: '1rem',
  },
  levelGroup: {
    display: 'flex',
    gap: '10px',
  },
  levelBtn: {
    flex: 1,
    borderRadius: '10px',
    padding: '12px',
    color: 'white',
    fontWeight: 700,
    fontSize: '1rem',
  },
  quantityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '4px',
  },
  quantityButton: {
    background: 'var(--purple)',
    color: 'white',
    borderRadius: '10px',
    minWidth: '48px',
    minHeight: '48px',
    fontSize: '1.4rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    minWidth: '40px',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '1.1rem',
  },
  addonGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    maxHeight: '180px',
    overflowY: 'auto',
  },
  addonBtn: {
    borderRadius: '10px',
    padding: '14px',
    color: 'white',
    fontWeight: 600,
    fontSize: '0.92rem',
  },
  modalFooter: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  backBtn: {
    background: 'var(--dark)',
    border: '1px solid var(--border)',
    color: 'white',
    borderRadius: '10px',
    padding: '10px 16px',
    fontWeight: 600,
  },
  historyHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '10px',
    gap: '12px',
    flexWrap: 'wrap',
  },
  historyItem: {
    paddingLeft: '10px',
    borderLeft: '2px solid var(--border)',
    marginBottom: '8px',
  },
  historyMeta: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
  },
  historyFooterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '10px',
    borderTop: '1px solid var(--border)',
    paddingTop: '10px',
    gap: '12px',
    flexWrap: 'wrap',
  },
  recBadge: {
    background: '#F59E0B',
    color: '#000',
    fontSize: '11px',
    fontWeight: 800,
    padding: '3px 10px',
    borderRadius: '99px',
    marginBottom: '4px',
  },
  tabsContainer: {
    display: 'flex',
    gap: '12px',
    paddingBottom: '16px',
    marginBottom: '24px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  tabButton: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    boxShadow: 'inset 0 0 0 2px var(--border)',
    background: 'var(--dark-card)',
    color: 'var(--text-muted)',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  activeTab: {
    background: 'var(--purple)',
    color: 'white',
    boxShadow: 'inset 0 0 0 2px var(--purple)',
  },
};