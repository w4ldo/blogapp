import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from './SimpleBlog'

describe.only('<SimpleBlog />', () => {
    it('renders title, author and number of likes', () => {
        const simpleBlog = {
            title: 'Komponenttitestaus tapahtuu jestillä ja enzymellä',
            author: "ossi",
            likes: 100
        }

        const simpleBlogComponent = shallow(<SimpleBlog blog={simpleBlog} />)
        /*console.log(simpleBlogComponent.debug())*/

        const contentDiv = simpleBlogComponent.find('.content')
        const likesDiv = simpleBlogComponent.find('.likes')

        expect(contentDiv.text()).toContain(simpleBlog.title)
        expect(contentDiv.text()).toContain(simpleBlog.author)
        expect(likesDiv.text()).toContain(simpleBlog.likes)

    })
    it('clicking the button calls event handler once', () => {
        const simpleBlog = {
            title: 'Komponenttitestaus tapahtuu jestillä ja enzymellä',
            author: "ossi",
            likes: 100
        }

        const mockHandler = jest.fn()

        const simpleBlogComponent = shallow(
            <SimpleBlog
                blog={simpleBlog}
                onClick={mockHandler}
            />)

        const button = simpleBlogComponent.find('button')
        button.simulate('click')
        button.simulate('click')

        expect(mockHandler.mock.calls.length).toBe(2)
    })
})
