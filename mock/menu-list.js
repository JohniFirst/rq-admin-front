import { responseFormat } from "./response-format"

export default [
  {
    url: '/api/menu/list',
    method: 'get',
    response: ({ query }) => {
      return responseFormat([
  {
    "menuOrder": 1,
    "title": "Dashboard",
    "id": 1,
    "url": "/dashboard",
    "icon": "test"
  },
  {
    "menuOrder": 2,
    "title": "Event",
    "id": 6,
    "url": "/event",
    "icon": "test",
    "children": [
      {
        "menuOrder": 1,
        "title": "Clipboard",
        "id": 2,
        "url": "/event/clipboard",
        "icon": "test"
      },
      {
        "menuOrder": 2,
        "title": "Cloud Album",
        "id": 3,
        "url": "/event/cloud-album",
        "icon": "test"
      },
      {
        "menuOrder": 3,
        "title": "Table",
        "id": 4,
        "url": "/event/table",
        "icon": "test"
      },
      {
        "menuOrder": 4,
        "title": "Table Frontend",
        "id": 5,
        "url": "/event/table-frontend",
        "icon": "test"
      }
    ]
  },
  {
    "menuOrder": 3,
    "title": "Event Pro",
    "id": 15,
    "url": "/event-pro",
    "icon": "test",
    "children": [
      {
        "menuOrder": 1,
        "title": "Animate",
        "id": 8,
        "url": "/event-pro/animate",
        "icon": "test",
        "children": [
          {
            "menuOrder": 1,
            "title": "Share Animation",
            "id": 7,
            "url": "/event-pro/animate/share-animation",
            "icon": "test"
          }
        ]
      },
      {
        "menuOrder": 2,
        "title": "Danmu",
        "id": 9,
        "url": "/event-pro/danmu",
        "icon": "test"
      },
      {
        "menuOrder": 3,
        "title": "Picture Stitching",
        "id": 11,
        "url": "/event-pro/picture-stitching",
        "icon": "test",
        "children": [
          {
            "menuOrder": 1,
            "title": "Css",
            "id": 10,
            "url": "/event-pro/picture-stitching/css",
            "icon": "test"
          }
        ]
      },
      {
        "menuOrder": 4,
        "title": "Video Player",
        "id": 14,
        "url": "/event-pro/video-player",
        "icon": "test",
        "children": [
          {
            "menuOrder": 1,
            "title": "Components",
            "id": 12,
            "url": "/event-pro/video-player/components",
            "icon": "test"
          },
          {
            "menuOrder": 2,
            "title": "Css",
            "id": 13,
            "url": "/event-pro/video-player/css",
            "icon": "test"
          }
        ]
      }
    ]
  },
  {
    "menuOrder": 4,
    "title": "System",
    "id": 20,
    "url": "/system",
    "icon": "test",
    "children": [
      {
        "menuOrder": 1,
        "title": "Menu",
        "id": 17,
        "url": "/system/menu",
        "icon": "test",
        "children": [
          {
            "menuOrder": 1,
            "title": "Components",
            "id": 16,
            "url": "/system/menu/components",
            "icon": "test"
          }
        ]
      },
      {
        "menuOrder": 2,
        "title": "Role",
        "id": 18,
        "url": "/system/role",
        "icon": "test"
      },
      {
        "menuOrder": 3,
        "title": "User",
        "id": 19,
        "url": "/system/user",
        "icon": "test"
      }
    ]
  }
])
    },
  },
]
