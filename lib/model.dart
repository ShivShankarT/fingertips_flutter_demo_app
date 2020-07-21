class QuizQuestion {
  int id;
  int point;
  String question;
  String questionImage;
  String answer;
  List<QuestionOption> options = new List();
  String selectedOption;
  String questionExplaination;
  String questionExplanationImage;

  QuizQuestion.fromMap(Map<String, dynamic> map) {
    id = map['id'];
    point = 1;
    question = map['question'];
    questionImage = map['ques_image'];
    answer = map['answer'];
    selectedOption = '';
    questionExplaination = map['question_explaination'];
    questionExplanationImage = map['question_explanation_image'];
    options.add(new QuestionOption(map['opt_a'], map['opt_a_type']));
    options.add(new QuestionOption(map['opt_b'], map['opt_b_type']));
    options.add(new QuestionOption(map['opt_c'], map['opt_c_type']));
    options.add(new QuestionOption(map['opt_d'], map['opt_d_type']));
  }
}

class QuestionOption {
  String option;
  String optionType;

  QuestionOption(String option, String optionType) {
    this.option = option;
    this.optionType = optionType;
  }
}
