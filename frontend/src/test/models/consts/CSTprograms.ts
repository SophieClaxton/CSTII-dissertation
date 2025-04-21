import { CSTProgram, CSTStepNodeType } from '../../../side_panel/models/CST/CST';

const emptyProgram: CSTProgram = {
  sections: [
    {
      id: { sectionId: 1 },
      url: 'www.test.com',
      innerSteps: [],
    },
  ],
};

const smallMissingElement: CSTProgram = {
  sections: [
    {
      id: { sectionId: 1 },
      url: 'www.test.com',
      innerSteps: [
        {
          id: { parentId: { sectionId: 1 }, stepId: 1 },
          type: CSTStepNodeType.Click,
        },
      ],
    },
  ],
};

const mediumProgram: CSTProgram = {
  sections: [
    {
      id: { sectionId: 1 },
      url: 'https://www.gov.uk/',
      endStep: {
        type: CSTStepNodeType.Follow,
        id: { parentId: { sectionId: 1 }, stepId: 'E' },
        nextSectionId: { sectionId: 2 },
        element: {
          outerHTML: `"<a class="govuk-link gem-c-cards__link gem-c-force-print-link-styles" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;homepage&quot;,&quot;index_link&quot;:1,&quot;index_section&quot;:5,&quot;index_section_count&quot;:6,&quot;index_total&quot;:6,&quot;section&quot;:&quot;Government activity&quot;}" href="/government/organisations">Departments</a>"`,
          tag: 'A',
          textContent: 'Departments',
          url: 'https://www.gov.uk/',
        },
      },
      innerSteps: [
        {
          id: { parentId: { sectionId: 1 }, stepId: 2 },
          type: CSTStepNodeType.ScrollTo,
          element: {
            outerHTML: `"<h2 class="gem-c-heading__text govuk-heading-l">Government activity</h2>"`,
            tag: 'H2',
            textContent: 'Government activity',
            url: 'https://www.gov.uk',
          },
        },
        {
          id: { parentId: { sectionId: 1 }, stepId: 1 },
          type: CSTStepNodeType.Read,
          element: {
            outerHTML: `"<h1 class="homepage-header__title">
        <span class="govuk-!-margin-bottom-2 govuk-!-display-block">GOV.UK</span>
        <span class="govuk-visually-hidden">-</span>
        <span class="homepage-header__intro homepage-inverse-header__intro--bold">The best place to find government services and information</span>
      </h1>"`,
            tag: 'H1',
            textContent: `"
        GOV.UK
        -
        The best place to find government services and information
      "`,
            url: 'https://www.gov.uk/',
          },
        },
      ],
    },
    {
      id: { sectionId: 2 },
      url: 'https://www.gov.uk/government/organisations',
      endStep: {
        id: { parentId: { sectionId: 2 }, stepId: 'E' },
        type: CSTStepNodeType.Follow,
        nextSectionId: { sectionId: 3 },
        element: {
          outerHTML: 'Blah',
          url: 'https://www.gov.uk/government/organisations',
          tag: 'A',
        },
      },
      innerSteps: [
        {
          id: { parentId: { sectionId: 2 }, stepId: 1 },
          type: CSTStepNodeType.Read,
          element: {
            outerHTML: 'Blah',
            url: 'https',
            tag: 'H2',
          },
        },
      ],
    },
    {
      id: { sectionId: 3 },
      url: 'https://www.gov.uk/government/organisations/department-for-education',
      innerSteps: [
        {
          id: { parentId: { sectionId: 3 }, stepId: 1 },
          type: CSTStepNodeType.Read,
          element: {
            outerHTML: 'Blah',
            tag: 'P',
            url: 'http',
          },
        },
      ],
    },
  ],
};

const smallInputsProgram: CSTProgram = {
  sections: [
    {
      innerSteps: [
        {
          element: {
            outerHTML:
              '<input id="radio-jp-ticket-type-return" name="jp-ticket-type" type="radio" data-testid="radio-jp-ticket-type-return" aria-required="true" class="sc-619f4b33-4 kXdgga" value="return">',
            url: 'https://www.nationalrail.co.uk/',
            tag: 'INPUT',
            textContent: '',
            label: 'Return',
          },
          id: {
            parentId: {
              sectionId: 1,
            },
            stepId: 1,
          },
          description: undefined,
          type: CSTStepNodeType.Select,
          selector: {
            selectType: 'radio',
          },
        },
      ],
      id: { sectionId: 1 },
      url: 'https://www.nationalrail.co.uk/',
    },
  ],
};

const complicatedProgramWithInputs: CSTProgram = {
  sections: [
    {
      innerSteps: [
        {
          element: {
            outerHTML:
              '<button data-testid="jp-preview-btn" aria-label="Plan Your Journey" class="sc-db83366f-7 ccFsfx"></button>',
            url: 'https://www.nationalrail.co.uk/',
            tag: 'BUTTON',
            textContent: '',
            label: undefined,
          },
          id: {
            parentId: {
              sectionId: 1,
            },
            stepId: 1,
          },
          type: CSTStepNodeType.Click,
        },
        {
          element: {
            outerHTML:
              '<input type="text" id="jp-origin" name="jp_origin" data-testid="input-jp-origin" placeholder="Station name or code" autocomplete="off" role="combobox" aria-required="true" aria-invalid="false" aria-expanded="false" aria-autocomplete="list" class="sc-907d34c8-2 hibVSI" value="" autofocus="" aria-describedby="iconlabel-label-jp-origin-tooltip">',
            url: 'https://www.nationalrail.co.uk/',
            tag: 'INPUT',
            textContent: '',
            label: 'Departing from',
          },
          id: {
            parentId: {
              sectionId: 1,
            },
            stepId: 2,
          },
          description: undefined,
          type: CSTStepNodeType.Write,
          text: 'Cambridge',
          isExact: true,
        },
        {
          element: {
            outerHTML:
              '<input type="text" id="jp-destination" name="jp_destination" data-testid="input-jp-destination" placeholder="Station name or code" autocomplete="off" role="combobox" aria-required="true" aria-invalid="false" aria-expanded="false" aria-autocomplete="list" class="sc-907d34c8-2 hibVSI" value="" aria-describedby="iconlabel-label-jp-destination-tooltip">',
            url: 'https://www.nationalrail.co.uk/',
            tag: 'INPUT',
            textContent: '',
            label: 'Going to',
          },
          id: {
            parentId: {
              sectionId: 1,
            },
            stepId: 3,
          },
          description: undefined,
          type: CSTStepNodeType.Write,
          text: 'London',
          isExact: true,
        },
        {
          element: {
            outerHTML:
              '<input id="radio-jp-ticket-type-return" name="jp-ticket-type" type="radio" data-testid="radio-jp-ticket-type-return" aria-required="true" class="sc-619f4b33-4 kXdgga" value="return">',
            url: 'https://www.nationalrail.co.uk/',
            tag: 'INPUT',
            textContent: '',
            label: 'Return',
          },
          id: {
            parentId: {
              sectionId: 1,
            },
            stepId: 4,
          },
          description: undefined,
          type: CSTStepNodeType.Select,
          selector: {
            selectType: 'radio',
          },
        },
        {
          element: {
            outerHTML:
              '<input type="text" id="return-date" name="return_date" data-testid="input-return-date" maxlength="17" autocomplete="off" aria-required="true" aria-invalid="false" inputmode="none" class="sc-907d34c8-2 jcCXAy" value="12 Mar 2025">',
            url: 'https://www.nationalrail.co.uk/',
            tag: 'INPUT',
            textContent: '',
            label: 'Choose return date',
          },
          id: {
            parentId: {
              sectionId: 1,
            },
            stepId: 5,
          },
          description: undefined,
          type: CSTStepNodeType.Write,
          text: 'Tomorrow',
          isExact: false,
        },
        {
          element: {
            outerHTML:
              '<select data-testid="dropdown-select-leaving-hour" id="leaving-hour" name="leaving-hour" aria-invalid="false" aria-required="true" class="sc-e9939e2c-3 bVUdYC"><option data-testid="dropdown-option-0-leaving-hour" value="00">00</option><option data-testid="dropdown-option-1-leaving-hour" value="01">01</option><option data-testid="dropdown-option-2-leaving-hour" value="02">02</option><option data-testid="dropdown-option-3-leaving-hour" value="03">03</option><option data-testid="dropdown-option-4-leaving-hour" value="04">04</option><option data-testid="dropdown-option-5-leaving-hour" value="05">05</option><option data-testid="dropdown-option-6-leaving-hour" value="06">06</option><option data-testid="dropdown-option-7-leaving-hour" value="07">07</option><option data-testid="dropdown-option-8-leaving-hour" value="08">08</option><option data-testid="dropdown-option-9-leaving-hour" value="09">09</option><option data-testid="dropdown-option-10-leaving-hour" value="10">10</option><option data-testid="dropdown-option-11-leaving-hour" value="11">11</option><option data-testid="dropdown-option-12-leaving-hour" value="12">12</option><option data-testid="dropdown-option-13-leaving-hour" value="13">13</option><option data-testid="dropdown-option-14-leaving-hour" value="14">14</option><option data-testid="dropdown-option-15-leaving-hour" value="15">15</option><option data-testid="dropdown-option-16-leaving-hour" value="16">16</option><option data-testid="dropdown-option-17-leaving-hour" value="17">17</option><option data-testid="dropdown-option-18-leaving-hour" value="18">18</option><option data-testid="dropdown-option-19-leaving-hour" value="19">19</option><option data-testid="dropdown-option-20-leaving-hour" value="20">20</option><option data-testid="dropdown-option-21-leaving-hour" value="21">21</option><option data-testid="dropdown-option-22-leaving-hour" value="22">22</option><option data-testid="dropdown-option-23-leaving-hour" value="23">23</option></select>',
            url: 'https://www.nationalrail.co.uk/',
            tag: 'SELECT',
            textContent: '000102030405060708091011121314151617181920212223',
            label: 'Choose leaving hour',
          },
          id: {
            parentId: {
              sectionId: 1,
            },
            stepId: 6,
          },
          description: undefined,
          type: CSTStepNodeType.Select,
          selector: {
            selectType: 'select',
            option: {
              value: '10',
              text: '10',
            },
          },
        },
        {
          element: {
            outerHTML:
              '<select data-testid="dropdown-select-return-type" id="return-type" name="return-type" aria-invalid="false" aria-required="true" class="sc-e9939e2c-3 bVUdYC"><option data-testid="dropdown-option-0-return-type" value="departing">Departing after</option><option data-testid="dropdown-option-1-return-type" value="arriving">Arriving by</option><option data-testid="dropdown-option-2-return-type" value="first">First train</option><option data-testid="dropdown-option-3-return-type" value="last">Last train</option></select>',
            url: 'https://www.nationalrail.co.uk/',
            tag: 'SELECT',
            textContent: 'Departing afterArriving byFirst trainLast train',
            label: 'Choose return departure option',
          },
          id: {
            parentId: {
              sectionId: 1,
            },
            stepId: 8,
          },
          description: undefined,
          type: CSTStepNodeType.Select,
          selector: {
            selectType: 'select',
            option: {
              value: 'arriving',
              text: 'Arriving by',
            },
          },
        },
        {
          element: {
            outerHTML:
              '<select data-testid="dropdown-select-return-hour" id="return-hour" name="return-hour" aria-invalid="false" aria-required="true" class="sc-e9939e2c-3 bVUdYC"><option data-testid="dropdown-option-0-return-hour" value="00">00</option><option data-testid="dropdown-option-1-return-hour" value="01">01</option><option data-testid="dropdown-option-2-return-hour" value="02">02</option><option data-testid="dropdown-option-3-return-hour" value="03">03</option><option data-testid="dropdown-option-4-return-hour" value="04">04</option><option data-testid="dropdown-option-5-return-hour" value="05">05</option><option data-testid="dropdown-option-6-return-hour" value="06">06</option><option data-testid="dropdown-option-7-return-hour" value="07">07</option><option data-testid="dropdown-option-8-return-hour" value="08">08</option><option data-testid="dropdown-option-9-return-hour" value="09">09</option><option data-testid="dropdown-option-10-return-hour" value="10">10</option><option data-testid="dropdown-option-11-return-hour" value="11">11</option><option data-testid="dropdown-option-12-return-hour" value="12">12</option><option data-testid="dropdown-option-13-return-hour" value="13">13</option><option data-testid="dropdown-option-14-return-hour" value="14">14</option><option data-testid="dropdown-option-15-return-hour" value="15">15</option><option data-testid="dropdown-option-16-return-hour" value="16">16</option><option data-testid="dropdown-option-17-return-hour" value="17">17</option><option data-testid="dropdown-option-18-return-hour" value="18">18</option><option data-testid="dropdown-option-19-return-hour" value="19">19</option><option data-testid="dropdown-option-20-return-hour" value="20">20</option><option data-testid="dropdown-option-21-return-hour" value="21">21</option><option data-testid="dropdown-option-22-return-hour" value="22">22</option><option data-testid="dropdown-option-23-return-hour" value="23">23</option></select>',
            url: 'https://www.nationalrail.co.uk/',
            tag: 'SELECT',
            textContent: '000102030405060708091011121314151617181920212223',
            label: 'Choose return hour',
          },
          id: {
            parentId: {
              sectionId: 1,
            },
            stepId: 7,
          },
          description: undefined,
          type: CSTStepNodeType.Select,
          selector: {
            selectType: 'select',
            option: {
              value: '22',
              text: '22',
            },
          },
        },
        {
          element: {
            outerHTML:
              '<button type="button" id="collapsable-button-jp-options" data-testid="collapsable-button-jp-options" aria-controls="button-label-jp-options" aria-expanded="false" class="sc-699c4153-1 jUPNHu"><span id="button-label-jp-options" data-testid="button-label-jp-options" class="sc-699c4153-0 fEumJi">Journey options</span><span class="sc-10f59b67-0 eLbPcI"><svg viewBox="0 0 32 32" width="1em" height="1em" fill="currentColor" data-testid="svg-plus-header-jp-options" aria-hidden="true"><path d="M15 5v10H5v2h10v10h2V17h10v-2H17V5z"></path></svg></span></button>',
            url: 'https://www.nationalrail.co.uk/',
            tag: 'BUTTON',
            textContent: 'Journey options',
            label: undefined,
          },
          id: {
            parentId: {
              sectionId: 1,
            },
            stepId: 9,
          },
          type: CSTStepNodeType.Click,
        },
        {
          element: {
            outerHTML:
              '<input data-testid="checkbox-fastest-trains" type="checkbox" class="sc-c362b927-2 eOuwuz" value="fastest_trains">',
            url: 'https://www.nationalrail.co.uk/',
            tag: 'INPUT',
            textContent: '',
            label: 'Fastest trains only',
          },
          id: {
            parentId: {
              sectionId: 1,
            },
            stepId: 10,
          },
          description: undefined,
          type: CSTStepNodeType.Select,
          selector: {
            selectType: 'check',
            isChecked: true,
          },
        },
      ],
      endStep: {
        element: {
          outerHTML:
            '<button type="submit" id="button-jp" data-testid="button-jp" aria-label="Get times and prices" class="sc-4a147b4f-0 fGVxOg"><span data-testid="button-label-wrapper-jp" class="sc-4a147b4f-3 cFmtHH"><span data-testid="button-label-jp" class="sc-4a147b4f-1 jjYYjW">Get times and prices</span></span><span data-testid="svg-jp-form-arrow-right-wrapper" class="sc-10f59b67-0 wDHTg"><svg xmlns="http://www.w3.org/2000/svg" data-testid="svg-jp-form-arrow-right" viewBox="0 0 12 12" aria-hidden="true" fill="#1D1D1F" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" x="0" y="0"><title data-testid="title" id="jp-form-arrow-right">ArrowRight Icon</title><path data-testid="small" d="M7.1,0.8L7.1,0.8l4.7,4.7c0,0,0,0,0.1,0.1l-0.1-0.1c0,0,0.1,0.1,0.1,0.1c0,0,0,0,0,0  c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0.1c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0l0,0c0,0,0,0,0,0L12,6  c0,0,0,0.1,0,0.1c0,0,0,0,0,0c0,0,0,0,0,0.1c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0-0.1,0.1-0.1,0.1l0,0l-4.7,4.7  c-0.3,0.3-0.7,0.3-0.9,0c-0.2-0.2-0.3-0.6-0.1-0.9l0.1-0.1l3.5-3.5l-9.1,0C0.3,6.7,0,6.4,0,6c0-0.3,0.3-0.6,0.6-0.7l0.1,0l9.1,0  L6.2,1.8C6,1.6,5.9,1.2,6.1,0.9l0.1-0.1C6.4,0.6,6.8,0.6,7.1,0.8z"></path></svg></span></button>',
          url: 'https://www.nationalrail.co.uk/',
          tag: 'BUTTON',
          textContent: 'Get times and pricesArrowRight Icon',
          label: undefined,
        },
        id: {
          parentId: {
            sectionId: 1,
          },
          stepId: 'E',
        },
        type: CSTStepNodeType.Follow,
        nextSectionId: {
          sectionId: 2,
        },
      },
      id: {
        sectionId: 1,
      },
      url: 'https://www.nationalrail.co.uk/',
    },
    {
      innerSteps: [],
      endStep: undefined,
      id: {
        sectionId: 2,
      },
      url: 'https://www.nationalrail.co.uk/journey-planner/?type=return&origin=CBG&destination=182&leavingType=departing&leavingDate=120325&leavingHour=20&leavingMin=00&returnType=arriving&returnDate=130325&returnHour=22&returnMin=00&adults=1&fastestTrains=&extraTime=0#O',
    },
  ],
};

const allCSTPrograms: {
  name: string;
  program: CSTProgram;
  expectedSuccess: boolean;
}[] = [
  { name: 'Empty Program', program: emptyProgram, expectedSuccess: true },
  {
    name: 'Small Program with Missing Element',
    program: smallMissingElement,
    expectedSuccess: false,
  },
  {
    name: 'Medium Complete Program',
    program: mediumProgram,
    expectedSuccess: true,
  },
  {
    name: 'Radio input program',
    program: smallInputsProgram,
    expectedSuccess: true,
  },
  {
    name: 'Complicated Complete Program',
    program: complicatedProgramWithInputs,
    expectedSuccess: true,
  },
];

export {
  allCSTPrograms,
  emptyProgram,
  smallMissingElement,
  mediumProgram,
  complicatedProgramWithInputs,
};
