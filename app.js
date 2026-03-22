const SAVE_KEY = "yield-street-capital-save-v1";
const MARKET_ROTATION_SECONDS = 40;
const OFFLINE_CAP_SECONDS = 8 * 60 * 60;
const MILESTONES = [10, 25, 50, 100];

const strategyDefs = [
  {
    id: "analystPod",
    name: "Analyst Pod",
    kicker: "Sponsor Coverage",
    description: "Junior underwriters grind through CIMs, lender decks, and first-pass screens.",
    baseCost: 20,
    costMultiplier: 1.15,
    baseIncome: 0.6,
    aumPerUnit: 4000000,
    unlockAt: 0
  },
  {
    id: "directLending",
    name: "Direct Lending Desk",
    kicker: "Unitranche",
    description: "Senior originators turn relationship coverage into recurring private credit flow.",
    baseCost: 180,
    costMultiplier: 1.15,
    baseIncome: 4.5,
    aumPerUnit: 14000000,
    unlockAt: 120
  },
  {
    id: "abfWarehouse",
    name: "ABF Warehouse",
    kicker: "Asset-Based Finance",
    description: "Finance collateral pools with advance rates, borrowing bases, and tighter structures.",
    baseCost: 2300,
    costMultiplier: 1.16,
    baseIncome: 38,
    aumPerUnit: 42000000,
    unlockAt: 1600
  },
  {
    id: "equipmentFinance",
    name: "Equipment Finance Channel",
    kicker: "Hard Assets",
    description: "Capture yield from fleet, industrial, and mission-critical equipment paper.",
    baseCost: 28000,
    costMultiplier: 1.16,
    baseIncome: 280,
    aumPerUnit: 95000000,
    unlockAt: 22000
  },
  {
    id: "receivablesFacility",
    name: "Receivables Facility",
    kicker: "Trade and Consumer",
    description: "Purchase and finance receivable pools with servicing, eligibility, and collection controls.",
    baseCost: 360000,
    costMultiplier: 1.17,
    baseIncome: 1950,
    aumPerUnit: 240000000,
    unlockAt: 280000
  },
  {
    id: "specialtyServicer",
    name: "Specialty Servicer Network",
    kicker: "Special Situations",
    description: "Workout capability stabilizes stressed pools and monetizes complexity others avoid.",
    baseCost: 4600000,
    costMultiplier: 1.17,
    baseIncome: 14200,
    aumPerUnit: 540000000,
    unlockAt: 3600000
  },
  {
    id: "navLending",
    name: "NAV Lending Platform",
    kicker: "Fund Finance",
    description: "Lend against diversified portfolio values and premium sponsor relationships.",
    baseCost: 62000000,
    costMultiplier: 1.18,
    baseIncome: 96000,
    aumPerUnit: 1800000000,
    unlockAt: 48000000
  },
  {
    id: "cloEngine",
    name: "CLO Structuring Engine",
    kicker: "Capital Markets",
    description: "Warehouse, ramp, and term out scale once the platform is institutional enough to securitize.",
    baseCost: 890000000,
    costMultiplier: 1.18,
    baseIncome: 640000,
    aumPerUnit: 4200000000,
    unlockAt: 680000000
  }
];

const upgradeDefs = [
  {
    id: "originationPlaybook",
    name: "Origination Playbook",
    description: "Documented sourcing scripts and lender mapping double deal-closing efficiency.",
    cost: 50,
    unlock: () => true,
    effect: (state) => {
      state.clickMultiplier *= 2;
    }
  },
  {
    id: "icCadence",
    name: "Weekly IC Cadence",
    description: "A repeatable investment committee rhythm triples Analyst Pod productivity.",
    cost: 450,
    unlock: (state) => state.counts.analystPod >= 5,
    effect: (state) => {
      state.strategyMultipliers.analystPod *= 3;
    }
  },
  {
    id: "warehouseLeverage",
    name: "Warehouse Leverage Line",
    description: "Balance-sheet leverage boosts Direct Lending and ABF Warehouse income.",
    cost: 6000,
    unlock: (state) => state.counts.directLending >= 5 || state.counts.abfWarehouse >= 1,
    effect: (state) => {
      state.strategyMultipliers.directLending *= 2;
      state.strategyMultipliers.abfWarehouse *= 2;
    }
  },
  {
    id: "collateralScoring",
    name: "Collateral Scoring Model",
    description: "Sharper advance rates and tighter eligibility screens lift the entire platform.",
    cost: 85000,
    unlock: (state) => state.counts.abfWarehouse >= 10,
    effect: (state) => {
      state.globalIncomeMultiplier *= 1.5;
      state.clickMultiplier *= 1.4;
    }
  },
  {
    id: "servicingMesh",
    name: "Servicing Mesh",
    description: "Integrated boarding, collections, and exception management double specialty finance throughput.",
    cost: 1100000,
    unlock: (state) => state.counts.equipmentFinance >= 8 || state.counts.receivablesFacility >= 3,
    effect: (state) => {
      state.strategyMultipliers.equipmentFinance *= 2;
      state.strategyMultipliers.receivablesFacility *= 2;
      state.strategyMultipliers.specialtyServicer *= 1.8;
    }
  },
  {
    id: "institutionalMandate",
    name: "Institutional Mandate",
    description: "A blue-chip LP anchor unlocks a larger fund, cheaper follow-on capital, and better talent.",
    cost: 16000000,
    unlock: (state) => state.lifetimeEarnings >= 60000000,
    effect: (state) => {
      state.globalIncomeMultiplier *= 2;
      state.clickMultiplier *= 2;
    }
  },
  {
    id: "portfolioSurveillance",
    name: "Portfolio Surveillance Stack",
    description: "Real-time covenant and collateral monitoring compounds every strategy’s performance.",
    cost: 180000000,
    unlock: (state) => state.counts.specialtyServicer >= 5,
    effect: (state) => {
      state.globalIncomeMultiplier *= 2.4;
    }
  },
  {
    id: "navProgrammatic",
    name: "Programmatic NAV Term Sheets",
    description: "Standardized legal packs and sponsor references accelerate fund-finance deployment.",
    cost: 2500000000,
    unlock: (state) => state.counts.navLending >= 3,
    effect: (state) => {
      state.strategyMultipliers.navLending *= 2.5;
      state.strategyMultipliers.cloEngine *= 2;
    }
  },
  {
    id: "ratingAgencyCoverage",
    name: "Rating Agency Coverage",
    description: "Securitization readiness compresses execution drag and scales the platform globally.",
    cost: 42000000000,
    unlock: (state) => state.counts.cloEngine >= 1,
    effect: (state) => {
      state.globalIncomeMultiplier *= 3;
      state.clickMultiplier *= 3;
    }
  }
];

const marketStates = [
  {
    id: "base",
    name: "Base Case",
    description: "Steady deployment with rational pricing and stable loss expectations.",
    incomeMultiplier: 1,
    clickMultiplier: 1
  },
  {
    id: "tightSpreads",
    name: "Tight Spreads",
    description: "Competition gets aggressive. Yield compresses, but sourcing gets easier.",
    incomeMultiplier: 0.86,
    clickMultiplier: 1.35
  },
  {
    id: "dislocation",
    name: "Dislocated Credit",
    description: "Capital retreats. Underwriting is harder, but deployed assets print exceptional returns.",
    incomeMultiplier: 1.35,
    clickMultiplier: 0.82
  },
  {
    id: "issuanceWindow",
    name: "ABS Issuance Window",
    description: "Securitization bids improve execution across warehousing and portfolio recycling.",
    incomeMultiplier: 1.18,
    clickMultiplier: 1.08
  }
];

const elements = {};

let state = loadState();
applyOfflineProgress(state);

function createInitialState() {
  return {
    cash: 25,
    lifetimeEarnings: 25,
    totalDeals: 0,
    counts: Object.fromEntries(strategyDefs.map((strategy) => [strategy.id, 0])),
    purchasedUpgrades: [],
    strategyMultipliers: Object.fromEntries(strategyDefs.map((strategy) => [strategy.id, 1])),
    clickBase: 1,
    clickMultiplier: 1,
    globalIncomeMultiplier: 1,
    buyMode: "1",
    lpTrust: 0,
    vintagesRaised: 0,
    bestAum: 0,
    marketIndex: 0,
    marketElapsed: 0,
    lastSavedAt: Date.now()
  };
}

function readNumber(value, fallback) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return createInitialState();
    }

    const parsed = JSON.parse(raw);
    const next = createInitialState();

    next.cash = readNumber(parsed.cash, next.cash);
    next.lifetimeEarnings = readNumber(parsed.lifetimeEarnings, next.lifetimeEarnings);
    next.totalDeals = readNumber(parsed.totalDeals, 0);
    next.clickBase = readNumber(parsed.clickBase, 1);
    next.clickMultiplier = readNumber(parsed.clickMultiplier, 1);
    next.globalIncomeMultiplier = readNumber(parsed.globalIncomeMultiplier, 1);
    next.buyMode = parsed.buyMode === "10" || parsed.buyMode === "max" ? parsed.buyMode : "1";
    next.lpTrust = readNumber(parsed.lpTrust, 0);
    next.vintagesRaised = readNumber(parsed.vintagesRaised, 0);
    next.bestAum = readNumber(parsed.bestAum, 0);
    next.marketIndex = Number.isInteger(parsed.marketIndex) ? parsed.marketIndex % marketStates.length : 0;
    next.marketElapsed = readNumber(parsed.marketElapsed, 0);
    next.lastSavedAt = readNumber(parsed.lastSavedAt, Date.now());

    for (const strategy of strategyDefs) {
      next.counts[strategy.id] = readNumber(parsed.counts?.[strategy.id], 0);
      next.strategyMultipliers[strategy.id] = readNumber(parsed.strategyMultipliers?.[strategy.id], 1);
    }

    if (Array.isArray(parsed.purchasedUpgrades)) {
      next.purchasedUpgrades = parsed.purchasedUpgrades.filter((value) =>
        upgradeDefs.some((upgrade) => upgrade.id === value)
      );
    }

    return next;
  } catch (error) {
    return createInitialState();
  }
}

function saveState(message = "Game saved.") {
  state.lastSavedAt = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  setSaveStatus(message);
}

function setSaveStatus(message) {
  if (elements.saveStatus) {
    elements.saveStatus.textContent = message;
  }
}

function resetState() {
  state = createInitialState();
  saveState("Save reset.");
  render();
}

function applyOfflineProgress(currentState) {
  const secondsAway = Math.max(0, Math.min(OFFLINE_CAP_SECONDS, (Date.now() - currentState.lastSavedAt) / 1000));
  if (secondsAway < 1) {
    return;
  }

  const earnings = getIncomePerSecond(currentState, true) * secondsAway;
  currentState.cash += earnings;
  currentState.lifetimeEarnings += earnings;
  currentState.bestAum = Math.max(currentState.bestAum, getAum(currentState));
  setTimeout(() => {
    setSaveStatus(`Offline production collected: ${formatMoney(earnings)}.`);
  }, 0);
}

function getMarketState(currentState = state) {
  return marketStates[currentState.marketIndex % marketStates.length];
}

function rotateMarket() {
  const previous = state.marketIndex;
  while (state.marketIndex === previous) {
    state.marketIndex = Math.floor(Math.random() * marketStates.length);
  }
  state.marketElapsed = 0;
}

function getPrestigeMultiplier(currentState = state) {
  return 1 + currentState.lpTrust * 0.12;
}

function getMilestoneMultiplier(count) {
  let multiplier = 1;
  if (count >= 10) multiplier *= 2;
  if (count >= 25) multiplier *= 2;
  if (count >= 50) multiplier *= 3;
  if (count >= 100) multiplier *= 4;
  return multiplier;
}

function getNextMilestone(count) {
  return MILESTONES.find((milestone) => count < milestone) ?? null;
}

function getStrategyCost(strategy, amount) {
  if (amount <= 0) {
    return 0;
  }

  const owned = state.counts[strategy.id];
  const initial = strategy.baseCost * strategy.costMultiplier ** owned;
  return initial * ((strategy.costMultiplier ** amount - 1) / (strategy.costMultiplier - 1));
}

function getMaxAffordable(strategy) {
  const owned = state.counts[strategy.id];
  const base = strategy.baseCost * strategy.costMultiplier ** owned;
  const ratio = strategy.costMultiplier;

  if (state.cash < base) {
    return 0;
  }

  return Math.floor(Math.log(1 + (state.cash * (ratio - 1)) / base) / Math.log(ratio));
}

function resolvePurchaseAmount(strategy) {
  if (state.buyMode === "max") {
    return getMaxAffordable(strategy);
  }

  if (state.buyMode === "10") {
    return 10;
  }

  return 1;
}

function getStrategyIncome(strategy, currentState = state, ignoreMarket = false) {
  const marketMultiplier = ignoreMarket ? 1 : getMarketState(currentState).incomeMultiplier;
  const count = currentState.counts[strategy.id];
  const strategyMultiplier = currentState.strategyMultipliers[strategy.id];
  return (
    count *
    strategy.baseIncome *
    strategyMultiplier *
    currentState.globalIncomeMultiplier *
    getMilestoneMultiplier(count) *
    getPrestigeMultiplier(currentState) *
    marketMultiplier
  );
}

function getIncomePerSecond(currentState = state, ignoreMarket = false) {
  return strategyDefs.reduce((sum, strategy) => sum + getStrategyIncome(strategy, currentState, ignoreMarket), 0);
}

function getAum(currentState = state) {
  const trustLift = 1 + currentState.lpTrust * 0.05;
  return strategyDefs.reduce((sum, strategy) => {
    return sum + currentState.counts[strategy.id] * strategy.aumPerUnit * getMilestoneMultiplier(currentState.counts[strategy.id]) * trustLift;
  }, 0);
}

function getClickValue(currentState = state) {
  const market = getMarketState(currentState);
  const aumLift = 1 + Math.sqrt(Math.max(getAum(currentState), 0) / 4000000) * 0.18;
  return currentState.clickBase * currentState.clickMultiplier * getPrestigeMultiplier(currentState) * market.clickMultiplier * aumLift;
}

function getAvailableTrust() {
  const gross = Math.floor(Math.sqrt(state.lifetimeEarnings / 250000));
  return Math.max(0, gross - state.lpTrust);
}

function performClick() {
  const value = getClickValue();
  state.cash += value;
  state.lifetimeEarnings += value;
  state.totalDeals += 1;
}

function buyStrategy(strategyId) {
  const strategy = strategyDefs.find((item) => item.id === strategyId);
  if (!strategy || state.lifetimeEarnings < strategy.unlockAt) {
    return;
  }

  const amount = resolvePurchaseAmount(strategy);
  if (amount <= 0) {
    return;
  }

  const cost = getStrategyCost(strategy, amount);
  if (cost > state.cash) {
    return;
  }

  state.cash -= cost;
  state.counts[strategy.id] += amount;
}

function buyUpgrade(upgradeId) {
  const upgrade = upgradeDefs.find((item) => item.id === upgradeId);
  if (!upgrade || state.purchasedUpgrades.includes(upgrade.id) || !upgrade.unlock(state) || state.cash < upgrade.cost) {
    return;
  }

  state.cash -= upgrade.cost;
  state.purchasedUpgrades.push(upgrade.id);
  upgrade.effect(state);
}

function raiseVintage() {
  const gain = getAvailableTrust();
  if (gain <= 0) {
    return;
  }

  const currentAum = getAum(state);
  state.lpTrust += gain;
  state.vintagesRaised += 1;
  state.cash = 25 + state.lpTrust * 12;
  state.lifetimeEarnings = state.cash;
  state.totalDeals = 0;
  state.counts = Object.fromEntries(strategyDefs.map((strategy) => [strategy.id, 0]));
  state.purchasedUpgrades = [];
  state.strategyMultipliers = Object.fromEntries(strategyDefs.map((strategy) => [strategy.id, 1]));
  state.clickBase = 1;
  state.clickMultiplier = 1;
  state.globalIncomeMultiplier = 1;
  state.marketIndex = 0;
  state.marketElapsed = 0;
  state.bestAum = Math.max(state.bestAum, currentAum);
  saveState(`New vintage raised. LP trust increased by ${gain}.`);
  render();
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  const abs = Math.abs(value);
  if (abs < 1000) {
    return value.toFixed(abs >= 100 ? 0 : abs >= 10 ? 1 : 2);
  }

  const units = [
    { value: 1e12, suffix: "T" },
    { value: 1e9, suffix: "B" },
    { value: 1e6, suffix: "M" },
    { value: 1e3, suffix: "K" }
  ];

  for (const unit of units) {
    if (abs >= unit.value) {
      return `${(value / unit.value).toFixed(abs >= unit.value * 100 ? 0 : 2)}${unit.suffix}`;
    }
  }

  return value.toFixed(2);
}

function formatMoney(value) {
  return `$${formatNumber(value)}`;
}

function getStrategyCard(strategy) {
  const owned = state.counts[strategy.id];
  const isUnlocked = state.lifetimeEarnings >= strategy.unlockAt;
  const purchaseAmount = isUnlocked ? resolvePurchaseAmount(strategy) : 0;
  const purchaseCost = purchaseAmount > 0 ? getStrategyCost(strategy, purchaseAmount) : strategy.baseCost;
  const nextMilestone = getNextMilestone(owned);
  const income = getStrategyIncome(strategy);
  const progress = nextMilestone ? Math.min(100, (owned / nextMilestone) * 100) : 100;

  if (!isUnlocked) {
    return `
      <article class="strategy-card">
        <div class="card-top">
          <div>
            <span class="card-kicker">${strategy.kicker}</span>
            <h3>${strategy.name}</h3>
          </div>
          <span class="locked-pill">Locked</span>
        </div>
        <p class="card-copy">${strategy.description}</p>
        <div class="metric-row">
          <div>
            <span class="mini-label">Unlock At</span>
            <strong>${formatMoney(strategy.unlockAt)}</strong>
          </div>
          <div>
            <span class="mini-label">Potential AUM</span>
            <strong>${formatMoney(strategy.aumPerUnit)}</strong>
          </div>
        </div>
        <div class="milestone-line">
          <span>Need more lifetime earnings to open this strategy.</span>
          <span>${formatMoney(Math.max(0, strategy.unlockAt - state.lifetimeEarnings))} to go</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${Math.min(100, (state.lifetimeEarnings / strategy.unlockAt) * 100)}%"></div>
        </div>
      </article>
    `;
  }

  return `
    <article class="strategy-card">
      <div class="card-top">
        <div>
          <span class="card-kicker">${strategy.kicker}</span>
          <h3>${strategy.name}</h3>
        </div>
        <span class="owned-pill">${formatNumber(owned)} owned</span>
      </div>
      <p class="card-copy">${strategy.description}</p>
      <div class="metric-row">
        <div>
          <span class="mini-label">Yield / sec</span>
          <strong>${formatMoney(income)}</strong>
        </div>
        <div>
          <span class="mini-label">AUM Added</span>
          <strong>${formatMoney(strategy.aumPerUnit)}</strong>
        </div>
      </div>
      <div class="milestone-line">
        <span>${nextMilestone ? `Next milestone at ${nextMilestone}` : "All milestones cleared"}</span>
        <span>${nextMilestone ? `${formatMoney(purchaseCost)} for ${purchaseAmount || 1}` : `${getMilestoneMultiplier(owned).toFixed(1)}x active`}</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width: ${progress}%"></div>
      </div>
      <button
        class="card-action"
        type="button"
        data-action="buy-strategy"
        data-id="${strategy.id}"
        ${purchaseAmount <= 0 || purchaseCost > state.cash ? "disabled" : ""}
      >
        Buy ${state.buyMode === "max" ? purchaseAmount || 0 : purchaseAmount} for ${formatMoney(purchaseCost)}
      </button>
    </article>
  `;
}

function getUpgradeCard(upgrade) {
  const purchased = state.purchasedUpgrades.includes(upgrade.id);
  const unlocked = upgrade.unlock(state);
  const canAfford = state.cash >= upgrade.cost;
  const classes = ["upgrade-card"];

  if (purchased) {
    classes.push("purchased");
  } else if (!unlocked) {
    classes.push("locked");
  }

  const status = purchased ? "Installed" : unlocked ? "Available" : "Pending";

  return `
    <article class="${classes.join(" ")}">
      <div class="card-top">
        <div>
          <span class="card-kicker">Platform Upgrade</span>
          <h3>${upgrade.name}</h3>
        </div>
        <span class="${purchased ? "owned-pill" : unlocked ? "owned-pill" : "locked-pill"}">${status}</span>
      </div>
      <p class="card-copy">${upgrade.description}</p>
      <div class="metric-row">
        <div>
          <span class="mini-label">Cost</span>
          <strong>${formatMoney(upgrade.cost)}</strong>
        </div>
        <div>
          <span class="mini-label">Status</span>
          <strong>${purchased ? "Applied" : unlocked ? "Ready to buy" : "Needs scale"}</strong>
        </div>
      </div>
      <button
        class="card-action"
        type="button"
        data-action="buy-upgrade"
        data-id="${upgrade.id}"
        ${purchased || !unlocked || !canAfford ? "disabled" : ""}
      >
        ${purchased ? "Upgrade Installed" : `Buy for ${formatMoney(upgrade.cost)}`}
      </button>
    </article>
  `;
}

function cacheElements() {
  elements.cashDisplay = document.getElementById("cashDisplay");
  elements.incomeDisplay = document.getElementById("incomeDisplay");
  elements.aumDisplay = document.getElementById("aumDisplay");
  elements.trustDisplay = document.getElementById("trustDisplay");
  elements.clickValueDisplay = document.getElementById("clickValueDisplay");
  elements.dealsDisplay = document.getElementById("dealsDisplay");
  elements.lifetimeDisplay = document.getElementById("lifetimeDisplay");
  elements.bestAumDisplay = document.getElementById("bestAumDisplay");
  elements.marketName = document.getElementById("marketName");
  elements.marketDescription = document.getElementById("marketDescription");
  elements.marketIncomeMult = document.getElementById("marketIncomeMult");
  elements.marketClickMult = document.getElementById("marketClickMult");
  elements.marketTimer = document.getElementById("marketTimer");
  elements.prestigeSummary = document.getElementById("prestigeSummary");
  elements.prestigeGain = document.getElementById("prestigeGain");
  elements.vintageDisplay = document.getElementById("vintageDisplay");
  elements.prestigeButton = document.getElementById("prestigeButton");
  elements.strategyGrid = document.getElementById("strategyGrid");
  elements.upgradeGrid = document.getElementById("upgradeGrid");
  elements.buyModeGroup = document.getElementById("buyModeGroup");
  elements.saveStatus = document.getElementById("saveStatus");
  elements.clickButton = document.getElementById("clickButton");
  elements.saveButton = document.getElementById("saveButton");
  elements.resetButton = document.getElementById("resetButton");
}

function bindEvents() {
  elements.clickButton.addEventListener("click", () => {
    performClick();
    render();
  });

  elements.buyModeGroup.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mode]");
    if (!button) {
      return;
    }

    state.buyMode = button.dataset.mode;
    render();
  });

  elements.strategyGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action='buy-strategy']");
    if (!button) {
      return;
    }

    buyStrategy(button.dataset.id);
    render();
  });

  elements.upgradeGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action='buy-upgrade']");
    if (!button) {
      return;
    }

    buyUpgrade(button.dataset.id);
    render();
  });

  elements.prestigeButton.addEventListener("click", () => {
    const gain = getAvailableTrust();
    if (gain <= 0) {
      return;
    }

    const confirmed = window.confirm(`Raise a new vintage for ${gain} LP Trust? This resets current progress.`);
    if (confirmed) {
      raiseVintage();
    }
  });

  elements.saveButton.addEventListener("click", () => {
    saveState("Manual save complete.");
  });

  elements.resetButton.addEventListener("click", () => {
    const confirmed = window.confirm("Reset your save file and restart the platform?");
    if (confirmed) {
      resetState();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      saveState("Progress saved.");
    }
  });
}

function render() {
  const market = getMarketState();
  const income = getIncomePerSecond();
  const aum = getAum();
  const clickValue = getClickValue();
  const trustGain = getAvailableTrust();

  state.bestAum = Math.max(state.bestAum, aum);

  elements.cashDisplay.textContent = formatMoney(state.cash);
  elements.incomeDisplay.textContent = formatMoney(income);
  elements.aumDisplay.textContent = formatMoney(aum);
  elements.trustDisplay.textContent = `${getPrestigeMultiplier().toFixed(2)}x`;
  elements.clickValueDisplay.textContent = `+ ${formatMoney(clickValue)} per deal`;
  elements.dealsDisplay.textContent = formatNumber(state.totalDeals);
  elements.lifetimeDisplay.textContent = formatMoney(state.lifetimeEarnings);
  elements.bestAumDisplay.textContent = formatMoney(state.bestAum);

  elements.marketName.textContent = market.name;
  elements.marketDescription.textContent = market.description;
  elements.marketIncomeMult.textContent = `${market.incomeMultiplier.toFixed(2)}x`;
  elements.marketClickMult.textContent = `${market.clickMultiplier.toFixed(2)}x`;
  elements.marketTimer.textContent = `${Math.max(0, Math.ceil(MARKET_ROTATION_SECONDS - state.marketElapsed))}s`;

  elements.prestigeGain.textContent = formatNumber(trustGain);
  elements.vintageDisplay.textContent = formatNumber(state.vintagesRaised);
  elements.prestigeSummary.textContent =
    trustGain > 0
      ? `Reset now to gain ${trustGain} LP Trust. Each trust point adds a permanent 12% multiplier to all future production.`
      : "Scale lifetime earnings further to unlock more LP trust on the next vintage raise.";
  elements.prestigeButton.disabled = trustGain <= 0;

  elements.strategyGrid.innerHTML = strategyDefs.map(getStrategyCard).join("");
  elements.upgradeGrid.innerHTML = upgradeDefs.map(getUpgradeCard).join("");

  for (const button of elements.buyModeGroup.querySelectorAll("[data-mode]")) {
    button.classList.toggle("is-active", button.dataset.mode === state.buyMode);
  }
}

function tick(deltaSeconds) {
  const earnings = getIncomePerSecond() * deltaSeconds;
  state.cash += earnings;
  state.lifetimeEarnings += earnings;
  state.marketElapsed += deltaSeconds;

  if (state.marketElapsed >= MARKET_ROTATION_SECONDS) {
    rotateMarket();
  }
}

function startGameLoop() {
  let lastFrame = performance.now();
  let lastRender = 0;

  function frame(now) {
    const deltaSeconds = Math.min(1, (now - lastFrame) / 1000);
    lastFrame = now;
    tick(deltaSeconds);
    if (now - lastRender >= 100) {
      render();
      lastRender = now;
    }
    window.requestAnimationFrame(frame);
  }

  window.requestAnimationFrame(frame);
}

function startAutosave() {
  window.setInterval(() => {
    saveState("Autosaved.");
  }, 5000);
}

cacheElements();
bindEvents();
render();
startGameLoop();
startAutosave();
