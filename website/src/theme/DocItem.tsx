import React from 'react';
import DocItem from '@theme-original/DocItem';
import AddFeedback from '@site/src/theme/Feedback/AddFeedback';


export default function DocItemWrapper(props) {
  return (
    <>
      <DocItem {...props} />
      <AddFeedback {...props}/>
    </>
  );
}