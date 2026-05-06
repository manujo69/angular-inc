import { TestBed } from '@angular/core/testing';
import { DataTableComponent, TableColumn } from './data-table.component';

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: false },
];

const data: Record<string, unknown>[] = [
  { id: '1', name: 'Charlie', email: 'charlie@test.com' },
  { id: '2', name: 'Alice', email: 'alice@test.com' },
  { id: '3', name: 'Bob', email: 'bob@test.com' },
];

describe('DataTableComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent],
    }).compileComponents();
  });

  function setup(rows = data) {
    const fixture = TestBed.createComponent(DataTableComponent);
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('data', rows);
    fixture.detectChanges();
    return fixture;
  }

  it('should create', () => {
    expect(setup().componentInstance).toBeTruthy();
  });

  it('should render column headers', () => {
    const ths = setup().nativeElement.querySelectorAll('th');
    expect(ths[0].textContent).toContain('Name');
    expect(ths[1].textContent).toContain('Email');
  });

  it('should render one row per data item', () => {
    const rows = setup().nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
  });

  it('should render cell values', () => {
    const cells = setup().nativeElement.querySelectorAll('tbody tr:first-child td');
    expect(cells[0].textContent.trim()).toBe('Charlie');
    expect(cells[1].textContent.trim()).toBe('charlie@test.com');
  });

  it('should show empty message when data is empty', () => {
    const el = setup([]).nativeElement as HTMLElement;
    expect(el.querySelector('td')?.textContent?.trim()).toBe('No data available');
  });

  it('should sort ascending on first click of a sortable column', () => {
    const fixture = setup();
    (fixture.nativeElement.querySelectorAll('th')[0] as HTMLElement).click();
    fixture.detectChanges();
    const firstCell = fixture.nativeElement.querySelector('tbody tr:first-child td') as HTMLElement;
    expect(firstCell.textContent?.trim()).toBe('Alice');
  });

  it('should toggle to descending on second click', () => {
    const fixture = setup();
    const nameHeader = fixture.nativeElement.querySelectorAll('th')[0] as HTMLElement;
    nameHeader.click();
    nameHeader.click();
    fixture.detectChanges();
    const firstCell = fixture.nativeElement.querySelector('tbody tr:first-child td') as HTMLElement;
    expect(firstCell.textContent?.trim()).toBe('Charlie');
  });

  it('should not sort when clicking a non-sortable column', () => {
    const fixture = setup();
    (fixture.nativeElement.querySelectorAll('th')[1] as HTMLElement).click();
    fixture.detectChanges();
    const firstCell = fixture.nativeElement.querySelector('tbody tr:first-child td') as HTMLElement;
    expect(firstCell.textContent?.trim()).toBe('Charlie');
  });

  it('should emit rowClick with row data on row click', () => {
    const fixture = setup();
    const emitted: Record<string, unknown>[] = [];
    fixture.componentInstance.rowClick.subscribe((row) => emitted.push(row));
    (fixture.nativeElement.querySelector('tbody tr') as HTMLElement).click();
    expect(emitted[0]).toEqual(data[0]);
  });
});
