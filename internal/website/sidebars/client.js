module.exports = [
  'client/api/index',
  'client/api/modules',
  {
    type: 'category',
    label: 'Enumerations',
    items: ['client/api/enums/selectiontype'],
  },
  {
    type: 'category',
    label: 'Classes',
    items: [
      'client/api/classes/eventhandler',
      'client/api/classes/gqlesserror',
      'client/api/classes/selection',
    ],
  },
  {
    type: 'category',
    label: 'Interfaces',
    items: [
      'client/api/interfaces/accessorcache',
      'client/api/interfaces/assignselections',
      'client/api/interfaces/buildandfetchselections',
      'client/api/interfaces/buildselection',
      'client/api/interfaces/clientoptions',
      'client/api/interfaces/gqlessclient',
      'client/api/interfaces/hydratecache',
      'client/api/interfaces/hydratecacheoptions',
      'client/api/interfaces/inlineresolveoptions',
      'client/api/interfaces/inlineresolved',
      'client/api/interfaces/innerclientstate',
      'client/api/interfaces/interceptormanager',
      'client/api/interfaces/mutate',
      'client/api/interfaces/mutatehelpers',
      'client/api/interfaces/parseschematypeinfo',
      'client/api/interfaces/prefetch',
      'client/api/interfaces/preparerender',
      'client/api/interfaces/prepassobjkey',
      'client/api/interfaces/refetch',
      'client/api/interfaces/resolveoptions',
      'client/api/interfaces/resolved',
      'client/api/interfaces/resolvers',
      'client/api/interfaces/retryconfigstate',
      'client/api/interfaces/scalars',
      'client/api/interfaces/scheduler',
      'client/api/interfaces/schema',
      'client/api/interfaces/selectionmanager',
      'client/api/interfaces/setcache',
      'client/api/interfaces/subscribeevents',
      'client/api/interfaces/subscriptionsclient',
      'client/api/interfaces/type',
    ],
  },
];
