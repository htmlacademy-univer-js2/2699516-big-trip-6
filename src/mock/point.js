export const mockPoint = [
  {
    'id': '70f99a70-fe6f-47e2-90de-39285a411729',
    'base_price': 4761,
    'date_from': '2026-03-13T18:31:05.737Z',
    'date_to': '2026-03-14T04:38:05.737Z',
    'destination': '9b486c00-2419-40b3-a7b2-4b21bf380e1f',
    'is_favorite': true,
    'offers': ['ac1a4451-bdae-4caa-9663-aa907e24db73', '59cf089b-112c-4f00-aa56-67cf03f5eabc', 'a6473e8a-fc31-4f3b-9a45-a87e5e2ccd90'],
    'type': 'train'
  },
  {
    'id': '9a7b4601-b0ad-4827-9d90-9ad09e29dd2d',
    'base_price': 2689,
    'date_from': '2026-03-14T14:28:05.737Z',
    'date_to': '2026-03-15T03:57:05.737Z',
    'destination': '6d5017b1-75e1-4843-8f46-d6acc9566f2d',
    'is_favorite': true,
    'offers': [],
    'type': 'train'
  },
  {
    'id': '49826261-c348-420e-b67d-02a726849cbc',
    'base_price': 5003,
    'date_from': '2026-03-21T08:12:05.737Z',
    'date_to': '2026-03-23T04:32:05.737Z',
    'destination': '503913f3-7ef6-474e-bffe-ea4966754c9b',
    'is_favorite': false,
    'offers': ['e261c0a8-80bc-47a2-80a5-4bb4f1ca7a90', '8bbbba3a-a362-4662-975d-b8e713ced0d2'],
    'type': 'drive'
  },
  {
    'id': '60785c0f-3c8c-46e8-853a-690a9097677e',
    'base_price': 697,
    'date_from': '2026-03-23T22:14:05.737Z',
    'date_to': '2026-03-25T22:20:05.737Z',
    'destination': 'f007374c-ee33-4ce4-9444-806e9570bf8f',
    'is_favorite': false,
    'offers': ['ecb0ee64-446e-4626-85d9-507b1e8d4762', 'bd261259-5868-48d4-a3d2-1203d8e02854', '6c6b66ef-913c-4af7-9b46-c7df7203855a'],
    'type': 'ship'
  },
  {
    'id': '8f659145-719f-4107-9b50-1b5921ed0946',
    'base_price': 5517,
    'date_from': '2026-03-26T09:11:05.737Z',
    'date_to': '2026-03-27T01:19:05.737Z',
    'destination': 'f007374c-ee33-4ce4-9444-806e9570bf8f',
    'is_favorite': false,
    'offers': [],
    'type': 'restaurant'
  },
  {
    'id': '9f75b9b5-a54b-4a4d-b87c-b36fb715ae49',
    'base_price': 2684,
    'date_from': '2026-03-28T06:00:05.737Z',
    'date_to': '2026-03-29T05:10:05.737Z',
    'destination': 'be82267b-c90a-442f-bf38-cb343142d61d',
    'is_favorite': false,
    'offers': ['59cf089b-112c-4f00-aa56-67cf03f5eabc', 'a6473e8a-fc31-4f3b-9a45-a87e5e2ccd90'],
    'type': 'train'
  }
];

export const getRandomArrayElement = (array) => array[Math.floor(Math.random() * array.length)];

export const getRandomPoint = () => getRandomArrayElement(mockPoint);
