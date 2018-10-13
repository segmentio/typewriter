import React from 'react'
import Router from 'next/router'
import Modal from '../components/Modal'
import Layout from '../components/Layout'
import * as analytics from './generated'

export default class extends React.Component<any> {
  static getInitialProps () {
    return {
      photos: new Array(15).fill(0).map((_, k) => k + 1)
    }
  }

  componentDidMount () {
    analytics.feedViewed({ profileId: '3' })
  }

  dismissModal () {
    Router.push('/')
  }

  showPhoto (e, id) {
    e.preventDefault()
    Router.push(`/?photoId=${id}`, `/photo?id=${id}`)
  }

  render () {
    const { url, photos } = this.props

    return (
      <Layout>
        <div className='list'>
          {
            url.query.photoId &&
              <Modal
                id={url.query.photoId}
                onDismiss={() => this.dismissModal()}
              />
          }
          {
            photos.map((id) => (
              <div key={id} className='photo'>
                <a
                  className='photoLink'
                  href={`/photo?id=${id}`}
                  onClick={(e) => this.showPhoto(e, id)}
                >
                  {id}
                </a>
              </div>
            ))
          }
          <style jsx>{`
            .list {
              padding: 50px;
              text-align: center;
            }
            .photo {
              display: inline-block;
            }
            .photoLink {
              color: #333;
              vertical-align: middle;
              cursor: pointer;
              background: #eee;
              display: inline-block;
              width: 250px;
              height: 250px;
              line-height: 250px;
              margin: 10px;
              border: 2px solid transparent;
            }
            .photoLink:hover {
              border-color: blue;
            }
          `}</style>
        </div>
      </Layout>
    )
  }
}