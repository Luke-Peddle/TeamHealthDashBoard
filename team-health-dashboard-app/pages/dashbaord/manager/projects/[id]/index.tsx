import React from 'react'
import axios from 'axios';
import Sprint from './sprint/Sprint';
import StoryCard from './StoryCard/StoryCard';
import AddStoryCard from './StoryCard/AddStoryCard';

export async function getServerSideProps(context) {
    const { id } = context.params;
  
    try {
        
      const projectResponse = await axios.get(`http://localhost:4000/api/project/${id}`);
      const storyCardResponse = await axios.get(`http://localhost:4000/api/storyCard/project/${id}`)

      const projectList = projectResponse.data;
      const project = projectList[0]
      
      const storyCards = storyCardResponse.data
      console.log(storyCards)
      return { props: { project, storyCards } };
    } catch (error) {
      console.error('Server-side fetch error:', error);
      return { props: {  project: {}, storyCards: [] } };
    }
  }

const index = ({project, storyCards}) => {
  return (
    <div>
            {project ? (
                <div>
                    <h1>{project.name }</h1>
                    <p>Project ID: {project.id}</p>
                </div>
            ) : (
                <p>No project data</p>
            )}
            
            <br/>
            <div>
            
            {storyCards && storyCards.length > 0 ? (
                storyCards.map(storyCard => (
                    <StoryCard key={storyCard.id} storyCard={storyCard} />
                ))
                

            ) : (
                <p>No story cards</p>
            )}
            <AddStoryCard />

            </div>
       
    </div>
  )
}

export default index