



import type { ForumActivity } from '@/lib/type'
import React from 'react'

function Community({data}:{data:ForumActivity[]}) {

    
    const communities = data.reduce((acc,ele)=>({...acc, [ele.communityName]: (acc[ele.communityName] || 0) + 1}), {})
    console.log(communities,"communities")
  return (
    <div>Community</div>
  )
}

export default Community