import {
  elementsMatch,
  extractElementAttribute,
  extractOpeningTag,
} from '../../content_scripts/elements/matchElements';
import { SelectableTag } from '../../panel/models/interfaceElement/selectableTag';

describe('extractOpeningTag', () => {
  it('extracts the opening tag', () => {
    const elementOuterHTML =
      '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index_section&quot;:1,&quot;index_link&quot;:9,&quot;index_section_count&quot;:3,&quot;index_total&quot;:16,&quot;section&quot;:&quot;Services and information&quot;}" href="https://www.gov.uk/browse/education">Education and learning</a>';
    const openingTag =
      'a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index_section&quot;:1,&quot;index_link&quot;:9,&quot;index_section_count&quot;:3,&quot;index_total&quot;:16,&quot;section&quot;:&quot;Services and information&quot;}" href="https://www.gov.uk/browse/education"';
    expect(extractOpeningTag(elementOuterHTML)).toBe(openingTag);
  });
});

describe('extractElementAttribute', () => {
  it('extracts the class attribute', () => {
    const elementOuterHTML =
      '<input type="checkbox" class="styled__StyledCheckboxInput-sc-11h6zls-2 cZPoGM" value="fastest_trains">';
    const attribute = 'class';
    expect(extractElementAttribute(elementOuterHTML, attribute)).toBe(
      'styled__StyledCheckboxInput-sc-11h6zls-2 cZPoGM',
    );
  });

  it('extracts the type attribute', () => {
    const elementOuterHTML =
      '<input type="checkbox" class="styled__StyledCheckboxInput-sc-11h6zls-2 cZPoGM" value="fastest_trains">';
    const attribute = 'type';
    expect(extractElementAttribute(elementOuterHTML, attribute)).toBe(
      'checkbox',
    );
  });

  it('extracts the value attribute', () => {
    const elementOuterHTML =
      '<input type="checkbox" class="styled__StyledCheckboxInput-sc-11h6zls-2 cZPoGM" value="fastest_trains">';
    const attribute = 'value';
    expect(extractElementAttribute(elementOuterHTML, attribute)).toBe(
      'fastest_trains',
    );
  });

  it('extracts the id attribute', () => {
    const elementOuterHTML =
      '<input type="checkbox" class="styled__StyledCheckboxInput-sc-11h6zls-2 cZPoGM" value="fastest_trains">';
    const attribute = 'id';
    expect(extractElementAttribute(elementOuterHTML, attribute)).toBeNull();
  });

  it('extracts the href attribute', () => {
    const elementOuterHTML =
      '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-ga4-link="{"event_name":"navigation","type":"header menu bar","index_section":1,"index_link":9,"index_section_count":3,"index_total":16,"section":"Services and information"}" href="https://www.gov.uk/browse/education">Education and learning</a>';
    const attribute = 'href';
    expect(extractElementAttribute(elementOuterHTML, attribute)).toBe(
      'https://www.gov.uk/browse/education',
    );
  });

  it('extracts id from select element', () => {
    const elementOuterHTML =
      '<select data-testid="dropdown-select-return-type" id="return-type" name="return-type" aria-invalid="false" aria-required="true" class="sc-e9939e2c-3 bVUdYC"><option data-testid="dropdown-option-0-return-type" value="departing">Departing after</option><option data-testid="dropdown-option-1-return-type" value="arriving">Arriving by</option><option data-testid="dropdown-option-2-return-type" value="last">Last train</option></select>';
    const attribute = 'id';
    expect(extractElementAttribute(elementOuterHTML, attribute)).toBe(
      'return-type',
    );
  });

  it('extracts empty href from anchor element', () => {
    const elementOuterHTML =
      '<a class="menu-toggle button toggled" data-overlay="site-navigation" href="">Menu</a>';
    const attribute = 'href';
    expect(extractElementAttribute(elementOuterHTML, attribute)).toBe('');
  });
});

describe('elementsMatch', () => {
  it('anchors with no href', () => {
    const element = document.createElement('a');
    element.setAttribute('href', '');
    element.setAttribute('class', 'menu-toggle button');
    element.setAttribute('data-overlay', 'site-navigation');
    element.innerText = 'Menu';

    const msgElement = {
      outerHTML:
        '<a class="menu-toggle button toggled" data-overlay="site-navigation" href="">Menu</a>',
      url: 'https://www.ealing.gov.uk/site/',
      tag: 'A' as SelectableTag,
      textContent: 'Menu',
      label: undefined,
    };

    expect(elementsMatch(element, msgElement, true)).toBe(true);
  });

  it('checkboxes with different data-ids match', () => {
    const element = document.createElement('input');
    element.setAttribute('type', 'checkbox');
    element.setAttribute('value', 'fastest_trains');
    element.setAttribute('data-testid', 'checkbox-fastest-trains');
    element.setAttribute('class', 'sc-c362b927');
    const msgElement = {
      outerHTML:
        '<input type="checkbox" class="styled__StyledCheckboxInput-sc-11h6zls-2 cZPoGM" value="fastest_trains">',
      tag: 'INPUT' as SelectableTag,
      textContent: '',
      url: 'nationalRail.co.uk',
    };
    expect(elementsMatch(element, msgElement)).toBe(true);
  });

  it('selects with different data-ids match', () => {
    const element = document.createElement('select');
    element.setAttribute('id', 'leaving-hour');
    element.setAttribute('name', 'leaving-hour');
    element.setAttribute('aria-invalid', 'false');
    element.setAttribute('aria-required', 'true');
    element.setAttribute(
      'class',
      'styled__StyledDropdownSelect-sc-3qzpuk-3 iUCXlf',
    );
    element.innerHTML =
      '<option value="00">00</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option>';
    const msgElement = {
      outerHTML:
        '<select data-testid="dropdown-select-leaving-hour" id="leaving-hour" name="leaving-hour" aria-invalid="false" aria-required="true" class="sc-e9939e2c-3 bVUdYC"><option data-testid="dropdown-option-0-leaving-hour" value="00">00</option><option data-testid="dropdown-option-1-leaving-hour" value="01">01</option><option data-testid="dropdown-option-2-leaving-hour" value="02">02</option><option data-testid="dropdown-option-3-leaving-hour" value="03">03</option><option data-testid="dropdown-option-4-leaving-hour" value="04">04</option><option data-testid="dropdown-option-5-leaving-hour" value="05">05</option><option data-testid="dropdown-option-6-leaving-hour" value="06">06</option><option data-testid="dropdown-option-7-leaving-hour" value="07">07</option><option data-testid="dropdown-option-8-leaving-hour" value="08">08</option><option data-testid="dropdown-option-9-leaving-hour" value="09">09</option><option data-testid="dropdown-option-10-leaving-hour" value="10">10</option><option data-testid="dropdown-option-11-leaving-hour" value="11">11</option><option data-testid="dropdown-option-12-leaving-hour" value="12">12</option><option data-testid="dropdown-option-13-leaving-hour" value="13">13</option><option data-testid="dropdown-option-14-leaving-hour" value="14">14</option><option data-testid="dropdown-option-15-leaving-hour" value="15">15</option><option data-testid="dropdown-option-16-leaving-hour" value="16">16</option><option data-testid="dropdown-option-17-leaving-hour" value="17">17</option><option data-testid="dropdown-option-18-leaving-hour" value="18">18</option><option data-testid="dropdown-option-19-leaving-hour" value="19">19</option><option data-testid="dropdown-option-20-leaving-hour" value="20">20</option><option data-testid="dropdown-option-21-leaving-hour" value="21">21</option><option data-testid="dropdown-option-22-leaving-hour" value="22">22</option><option data-testid="dropdown-option-23-leaving-hour" value="23">23</option></select>',
      tag: 'SELECT' as SelectableTag,
      textContent: '',
      url: 'nationalRail.co.uk',
    };
    expect(elementsMatch(element, msgElement)).toBe(true);
  });

  it('button with only aria-label matches', () => {
    const element = document.createElement('button');
    element.setAttribute('aria-label', 'Plan Your Journey');
    element.setAttribute('class', 'sc-db83366f-7 ccFsfx');
    const msgElement = {
      outerHTML:
        '<button data-testid="jp-preview-btn" aria-label="Plan Your Journey" class="sc-db83366f-7 ccFsfx"></button>',
      tag: 'BUTTON' as SelectableTag,
      textContent: '',
      url: 'nationalRail.co.uk',
    };
    expect(elementsMatch(element, msgElement)).toBe(true);
  });

  it('anchors with same href match', () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'https://www.gov.uk/browse/education');
    element.setAttribute(
      'data-ga4-link',
      '{"event_name":"navigation","type":"header menu bar","index_section":1,"index_link":9,"index_section_count":3,"index_total":16,"section":"Services and information"}',
    );
    element.setAttribute(
      'class',
      'govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link',
    );
    element.textContent = 'Education and learning';
    const msgElement = {
      outerHTML:
        '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-ga4-link="{"event_name":"navigation","type":"header menu bar","index_section":1,"index_link":9,"index_section_count":3,"index_total":16,"section":"Services and information"}" href="https://www.gov.uk/browse/education">Education and learning</a>',
      url: 'https://www.gov.uk/',
      tag: 'A' as SelectableTag,
      textContent: 'Education and learning',
      label: undefined,
    };
    expect(elementsMatch(element, msgElement, true)).toBe(true);
  });

  it('anchors match', () => {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'https://www.officeforstudents.org.uk/advice-and-guidance/the-register/the-ofs-register',
    );
    element.setAttribute('rel', 'external');
    element.setAttribute('class', '');
    element.textContent = 'the Office for Students (OfS) Register';
    const msgElement = {
      outerHTML:
        '<a rel="external" href="https://www.officeforstudents.org.uk/advice-and-guidance/the-register/the-ofs-register" class="">the Office for Students (<abbr title="Office for Students">OfS</abbr>) Register</a>',
      url: 'https://www.gov.uk/check-university-award-degree',
      tag: 'A' as SelectableTag,
      textContent: 'the Office for Students (OfS) Register',
    };
    expect(elementsMatch(element, msgElement, true)).toBe(true);
  });

  it('inputs match with ids', () => {
    const element = document.createElement('input');
    element.setAttribute('id', 'mat-input-0');
    element.setAttribute(
      'class',
      'mat-input-element mat-form-field-autofill-control mat-autocomplete-trigger ng-tns-c31-0 ng-untouched ng-pristine ng-valid cdk-text-field-autofill-monitored',
    );
    element.setAttribute('type', 'text');
    element.setAttribute('role', 'combobox');
    element.setAttribute('aria-label', 'Provider name');
    const msgElement = {
      outerHTML:
        '<input _ngcontent-agx-c39="" type="text" aria-label="Provider name" matinput="" class="mat-input-element mat-form-field-autofill-control mat-autocomplete-trigger ng-tns-c31-0 ng-untouched ng-pristine ng-valid cdk-text-field-autofill-monitored" id="mat-input-0" data-placeholder="Search for a provider" aria-invalid="false" aria-required="false" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="true" aria-haspopup="true" aria-owns="mat-autocomplete-0">',
      url: 'https://www.officeforstudents.org.uk/for-providers/regulatory-resources/the-ofs-register/#/',
      tag: 'INPUT' as SelectableTag,
      textContent: '',
      label: 'Search for a provider',
    };
    expect(elementsMatch(element, msgElement, true)).toBe(true);
  });
});
