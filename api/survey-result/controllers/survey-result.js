'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

// api/quiz/controllers/quiz.js
'use strict';

module.exports = {
  async create ( ctx ) {
    try {
      let {userAnswers} = ctx.request.body;
      let {userId} = ctx.request.body;
      let {survey} = ctx.request.body;
      console.log(userAnswers);
      for ( const ans of userAnswers ) {
        const newSurvery =  await strapi.query('survey-result').create({
          survey,
          user:userId,
          question:ans.questionId,
          answer:ans.value
        });

        console.log('newSurvery',newSurvery)
      }


      // let quiz = await strapi.query('quiz').findOne({id});
      // let question;
      // let score = 0;
      // if ( quiz ) {
      //   userAnswers.map(( userAnsw ) => {
      //     question = quiz.questions.find(( qst ) => qst.id === userAnsw.questionId);
      //     if ( question ) {
      //       if ( question.answer === userAnsw.value ) {
      //         userAnsw.correct = true;
      //         score += 1;
      //       } else {
      //         userAnsw.correct = false;
      //       }
      //       userAnsw.correctValue = question.answer;
      //     }
      //     return userAnsw;
      //   });
      // }

      // const questionCount = quiz.questions.length;
      // delete quiz.questions;
      const user = await strapi.query('users').findOne({_id: userId});
      console.log(user);
      await strapi.query('users').model.updateOne(
        {_id: userId}, {$set: {betChips: user.betChips + userAnswers.length}});
      return {totalChips:userAnswers.length};

    } catch ( e ) {
  	return e
  }
  }
};
