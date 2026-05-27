import {
  defaultLayout, readLayout, saveLayout,
} from '../dashboardLayoutStorage';

const STORAGE_KEY = 'businessplanner-dashboard-layout';

beforeEach(() => {
  localStorage.clear();
});

describe('defaultLayout', () => {
  it('returns a non-empty array with all widgets visible', () => {
    const layout = defaultLayout();
    expect(layout.length).toBeGreaterThan(0);
    expect(layout.every((w) => w.visible)).toBe(true);
  });

  it('includes widget ids matching dashboard-widgets.json', () => {
    const layout = defaultLayout();
    const ids = layout.map((w) => w.id);
    expect(ids).toContain('stats');
    expect(ids).toContain('streak');
    expect(ids).toContain('progress');
  });
});

describe('readLayout', () => {
  it('returns default layout when localStorage is empty', () => {
    const layout = readLayout();
    expect(layout).toEqual(defaultLayout());
  });

  it('returns persisted layout from localStorage', () => {
    const saved = [{ id: 'stats' as const, visible: false }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    expect(readLayout()).toEqual(saved);
  });

  it('falls back to defaults on invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'broken-json');
    expect(readLayout()).toEqual(defaultLayout());
  });
});

describe('saveLayout', () => {
  it('persists layout to localStorage', () => {
    const layout = [{ id: 'streak' as const, visible: true }];
    saveLayout(layout);
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(JSON.parse(raw ?? '[]')).toEqual(layout);
  });

  it('readLayout returns what saveLayout saved', () => {
    const layout = defaultLayout().map((w, i) => ({
      ...w, visible: i % 2 === 0,
    }));
    saveLayout(layout);
    expect(readLayout()).toEqual(layout);
  });
});
