import { CSTProgram, CSTStepNodeType } from '../../../panel/models/CST/CST';

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
];

export { allCSTPrograms, emptyProgram };
