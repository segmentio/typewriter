import React from 'react'
import Link from 'next/link'

import Analytics from '../analytics/generated'

export default class Frame extends React.Component {
  componentDidMount() {
    const appAnalytics = new Analytics(global.analytics)
    appAnalytics.photoViewed({ photo_id: this.props.id })
  }

  render() {
    const id = this.props.id

    return (
      <div className='photo'>
        <div className='image'>
          {id}
        </div>

        <div className='sidebar'>
          <ul className='sidebarList'>
            <li>
              <Link href='/profile?id=segment'><a>@segment</a></Link>
              - Great photo!
            </li>
          </ul>
        </div>

        <style jsx>{`
          .photo {
            width: 800px;
            overflow: hidden;
            height: 500px;
            display: inline-block;
          }
          .image {
            float: left;
            width: 600px;
            height: 500px;
            background: #333;
            color: #fff;
            text-align: center;
            vertical-align: middle;
            line-height: 500px;
            font-size: 40px;
          }
          .sidebar {
            float: right;
            background: #fff;
            width: 200px;
            height: 500px;
            text-align: left;
            box-sizing: border-box;
            padding: 20px;
            font-family: Monaco;
            font-size: 11px;
          }
          .sidebarList {
            list-style-type: none;
            margin: 0;
            padding: 0;
          }
        `}</style>
      </div>
    )
  }
}
