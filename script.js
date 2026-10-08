/* =====================================================
   CLINICA MEDICARE®
   2-MINUTE HAIR ASSESSMENT
   COMPLETE UPDATED FRONTEND LOGIC
===================================================== */


/* =====================================================
   SUPABASE
===================================================== */

const SUPABASE_URL =
    "https://stejywpaxavvmjkzndwh.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_KxxqH7WDzoB6aI4MuBcUpA_XAWnVr0K";

const SCALP_BUCKET =
    "patient-scalp-photos";

const HAIR_PLAN_URL =
    "https://stejywpaxavvmjkzndwh.supabase.co/storage/v1/object/public/hair-care-plans/Clinica%20Medicare%20Diet%20Plan%20for%2030%20Days.pdf";

const WHATSAPP_NUMBER =
    "917049271066";

let supabaseClient = null;


/* =====================================================
   STATE
===================================================== */

const state = {
    language: "en",

    gender: null,

    hairFallDuration: null,

    selectedStage: null,

    questionIndex: 0,

    answers: [],

    recentAnswers: [],

    scalpPhoto: null,

    uploadedPhotoPath: null,

    lastSubmissionId: null,

    isSaving: false
};


/* =====================================================
   TRANSLATIONS
===================================================== */

const translations = {

    en: {

        startTest:
            "START 2-MINUTE HAIR TEST",

        viewPlan:
            "VIEW 7-DAY PLAN",

        benefit1Title:
            "Quick",

        benefit1Text:
            "2-minute test",

        benefit2Title:
            "Personalised",

        benefit2Text:
            "guidance",

        benefit3Title:
            "Hair care &",

        benefit3Text:
            "diet plan",

        genderQuestion:
            "Which assessment would you like to take?",

        men:
            "Men",

        menDescription:
            "Male-pattern hair loss assessment",

        women:
            "Women",

        womenDescription:
            "Female-pattern hair thinning assessment",

        durationQuestion:
            "How long have you been experiencing increased hair fall?",

        durationHelper:
            "This helps us show you the most relevant questions for your current concern.",

        less30Title:
            "Less than 30 days",

        less30Description:
            "Recent or sudden increase in hair fall",

        more30Title:
            "More than 30 days",

        more30Description:
            "Ongoing hair fall or gradual thinning",

        stageQuestion:
            "Which stage most closely matches your current hair loss?",

        photoQuestion:
            "Upload a clear photo of your scalp.",

        photoDescription:
            "Good lighting and a clear view of the hair pattern work best.",

        choosePhoto:
            "Choose Photo",

        photoOptional:
            "Scalp photo is optional. You can continue without uploading one.",

        continue:
            "Continue →",

        nextQuestion:
            "Next →",

        back:
            "Back",

        leadTitle:
            "Your hair assessment is ready.",

        leadDescription:
            "Enter your details to view your personalized hair assessment and get the right next step from Clinica Medicare.",

        fullNameLabel:
            "Full Name",

        fullNamePlaceholder:
            "Enter your full name",

        whatsappLabel:
            "WhatsApp Number",

        ageLabel:
            "Age Group",

        cityLabel:
            "City",

        cityPlaceholder:
            "Enter your city",

        consent:
            "I agree to be contacted by Clinica Medicare regarding my hair assessment and consultation.",

        viewAssessment:
            "View My Hair Assessment →",

        assessment:
            "YOUR ASSESSMENT",

        disclaimer:
            "This online assessment is for guidance and does not replace a clinical diagnosis.",

        invalidPhone:
            "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.",

        validPhone:
            "Valid mobile number",

        selectAnswer:
            "Please select an answer.",

        invalidPhoto:
            "Please select a valid image file.",

        photoTooLarge:
            "Please choose an image under 10MB.",

        selectStage:
            "Please select a stage first.",

        saving:
            "Preparing your assessment...",

        saveError:
            "We couldn't save your assessment right now. Please try again.",

        nameRequired:
            "Please enter your full name.",

        ageRequired:
            "Please select your age group.",

        cityRequired:
            "Please enter your city.",

        consentRequired:
            "Please accept the contact consent.",

        earlyResultTitle:
            "Early Stage / Less Than 30 Days",

        earlyResultText:
            "Your hair-fall concern appears to be in an early stage. There is no need to panic. Start with the recommended 3–4 week Hair Care & Diet Plan and follow it consistently for 30 days.",

        possibleFactors:
            "Possible contributing factors",

        downloadPlanLabel:
            "DOWNLOAD YOUR 30-DAY HAIR CARE PLAN",

        planTitle:
            "Get your personalised Hair Care & Diet Plan",

        downloadPlan:
            "DOWNLOAD 30-DAY PLAN",

        consultationEyebrow:
            "WANT TO CONSULT OUR DOCTOR?",

        consultationTitle:
            "Consultation Fee: ₹150/- only",

        consultationText:
            "You don't have to wait 30 days. If you are concerned about your hair fall or want to understand your condition better, you can consult our doctor anytime.",

        bookConsultation:
            "BOOK ₹150 CONSULTATION",

        restart:
            "Take the assessment again",

        recentDiet:
            "Diet / eating pattern",

        recentStress:
            "Stress / sleep changes",

        recentIllness:
            "Recent illness / fever / infection",

        recentEnvironment:
            "Water / weather / environmental change",

        recentScalp:
            "Scalp-related concerns",

        noFactor:
            "No major contributing factor identified"
    },


    hi: {

        startTest:
            "2 मिनट का हेयर टेस्ट शुरू करें",

        viewPlan:
            "7-दिन का प्लान देखें",

        benefit1Title:
            "त्वरित",

        benefit1Text:
            "2 मिनट का टेस्ट",

        benefit2Title:
            "व्यक्तिगत",

        benefit2Text:
            "मार्गदर्शन",

        benefit3Title:
            "हेयर केयर व",

        benefit3Text:
            "डाइट प्लान",

        genderQuestion:
            "आप कौन-सा मूल्यांकन लेना चाहते हैं?",

        men:
            "पुरुष",

        menDescription:
            "पुरुष पैटर्न हेयर लॉस मूल्यांकन",

        women:
            "महिला",

        womenDescription:
            "महिला पैटर्न हेयर थिनिंग मूल्यांकन",

        durationQuestion:
            "आपके बालों का झड़ना बढ़े हुए कितने समय से हो रहा है?",

        durationHelper:
            "इससे हमें आपकी वर्तमान समस्या के अनुसार सही सवाल दिखाने में मदद मिलती है।",

        less30Title:
            "30 दिनों से कम",

        less30Description:
            "हाल ही में या अचानक बढ़ा हुआ बाल झड़ना",

        more30Title:
            "30 दिनों से अधिक",

        more30Description:
            "लगातार बाल झड़ना या धीरे-धीरे बाल पतले होना",

        stageQuestion:
            "कौन-सा स्टेज आपके वर्तमान बाल झड़ने से सबसे अधिक मेल खाता है?",

        photoQuestion:
            "अपने स्कैल्प की एक साफ तस्वीर अपलोड करें।",

        photoDescription:
            "अच्छी रोशनी और बालों के पैटर्न का साफ दृश्य सबसे बेहतर रहेगा।",

        choosePhoto:
            "तस्वीर चुनें",

        photoOptional:
            "स्कैल्प की तस्वीर वैकल्पिक है। आप बिना तस्वीर अपलोड किए आगे बढ़ सकते हैं।",

        continue:
            "आगे बढ़ें →",

        nextQuestion:
            "आगे बढ़ें →",

        back:
            "वापस",

        leadTitle:
            "आपका हेयर असेसमेंट तैयार है।",

        leadDescription:
            "अपना व्यक्तिगत हेयर असेसमेंट देखने और Clinica Medicare से सही अगला कदम जानने के लिए अपनी जानकारी भरें।",

        fullNameLabel:
            "पूरा नाम",

        fullNamePlaceholder:
            "अपना पूरा नाम लिखें",

        whatsappLabel:
            "WhatsApp नंबर",

        ageLabel:
            "आयु वर्ग",

        cityLabel:
            "शहर",

        cityPlaceholder:
            "अपने शहर का नाम लिखें",

        consent:
            "मैं सहमत हूँ कि Clinica Medicare मेरे हेयर असेसमेंट और परामर्श के संबंध में मुझसे संपर्क कर सकता है।",

        viewAssessment:
            "मेरा हेयर असेसमेंट देखें →",

        assessment:
            "आपका मूल्यांकन",

        disclaimer:
            "यह ऑनलाइन मूल्यांकन केवल मार्गदर्शन के लिए है और चिकित्सकीय निदान का विकल्प नहीं है।",

        invalidPhone:
            "कृपया 6, 7, 8 या 9 से शुरू होने वाला सही 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।",

        validPhone:
            "मोबाइल नंबर सही है",

        selectAnswer:
            "कृपया एक उत्तर चुनें।",

        invalidPhoto:
            "कृपया सही इमेज फाइल चुनें।",

        photoTooLarge:
            "कृपया 10MB से कम की तस्वीर चुनें।",

        selectStage:
            "कृपया पहले एक स्टेज चुनें।",

        saving:
            "आपका असेसमेंट तैयार किया जा रहा है...",

        saveError:
            "अभी आपका असेसमेंट सेव नहीं हो पाया। कृपया दोबारा कोशिश करें।",

        nameRequired:
            "कृपया अपना पूरा नाम दर्ज करें।",

        ageRequired:
            "कृपया अपना आयु वर्ग चुनें।",

        cityRequired:
            "कृपया अपना शहर दर्ज करें।",

        consentRequired:
            "कृपया संपर्क की सहमति स्वीकार करें।",

        earlyResultTitle:
            "प्रारंभिक स्टेज / 30 दिनों से कम",

        earlyResultText:
            "आपकी बाल झड़ने की समस्या शुरुआती चरण में दिखाई देती है। घबराने की आवश्यकता नहीं है। सुझाए गए 3–4 सप्ताह के Hair Care & Diet Plan को लगातार 30 दिनों तक अपनाएं।",

        possibleFactors:
            "संभावित योगदान देने वाले कारक",

        downloadPlanLabel:
            "अपना 30-दिन का हेयर केयर प्लान डाउनलोड करें",

        planTitle:
            "अपना व्यक्तिगत Hair Care & Diet Plan प्राप्त करें",

        downloadPlan:
            "30-दिन का प्लान डाउनलोड करें",

        consultationEyebrow:
            "क्या आप हमारे डॉक्टर से सलाह लेना चाहते हैं?",

        consultationTitle:
            "कंसल्टेशन फीस: केवल ₹150/-",

        consultationText:
            "आपको 30 दिन इंतजार करने की जरूरत नहीं है। यदि आप अपने बाल झड़ने को लेकर चिंतित हैं या अपनी स्थिति बेहतर समझना चाहते हैं, तो आप कभी भी डॉक्टर से सलाह ले सकते हैं।",

        bookConsultation:
            "₹150 कंसल्टेशन बुक करें",

        restart:
            "असेसमेंट दोबारा लें",

        recentDiet:
            "खान-पान में बदलाव",

        recentStress:
            "तनाव / नींद में बदलाव",

        recentIllness:
            "हाल की बीमारी / बुखार / संक्रमण",

        recentEnvironment:
            "पानी / मौसम / वातावरण में बदलाव",

        recentScalp:
            "स्कैल्प से जुड़ी समस्या",

        noFactor:
            "कोई प्रमुख योगदान कारक स्पष्ट नहीं"
    }

};


/* =====================================================
   MALE STAGES
===================================================== */

const maleStages = [

    {
        stage: 1,
        image: "male_baldness_stage_1.png",

        en: {
            title: "Minimal Hair Loss",
            description:
                "Hair is mostly full with little to no thinning.",
            meaning:
                "Your selected pattern shows little to no visible thinning, with overall hair density appearing relatively well maintained.",
            recommendation:
                "Maintain a consistent hair-care routine and keep an eye on any changes in hair fall, hairline or density."
        },

        hi: {
            title: "न्यूनतम बाल झड़ना",
            description:
                "बाल लगभग पूरी तरह घने हैं और बहुत कम या कोई स्पष्ट पतलापन नहीं दिखता।",
            meaning:
                "आपके चुने गए पैटर्न में बालों का घनत्व काफी हद तक बना हुआ दिखाई देता है और स्पष्ट पतलापन बहुत कम है।",
            recommendation:
                "नियमित हेयर-केयर रूटीन बनाए रखें और बाल झड़ने, हेयरलाइन या घनत्व में किसी भी बदलाव पर ध्यान दें।"
        }
    },

    {
        stage: 2,
        image: "male_baldness_stage_2.png",

        en: {
            title: "Early Hairline Recession",
            description:
                "Slight thinning at the front or mild hairline recession.",
            meaning:
                "Your selected pattern shows slight thinning around the front or mild hairline recession.",
            recommendation:
                "Because you have noticed a visible change, an early professional evaluation may help you understand your individual hair and scalp condition."
        },

        hi: {
            title: "शुरुआती हेयरलाइन रीसैशन",
            description:
                "सामने की ओर हल्का पतलापन या हल्का हेयरलाइन पीछे जाना।",
            meaning:
                "आपके चुने गए पैटर्न में सामने की ओर हल्का पतलापन या हेयरलाइन में हल्का बदलाव दिखाई देता है।",
            recommendation:
                "क्योंकि आपको दिखाई देने वाला बदलाव महसूस हुआ है, इसलिए शुरुआती विशेषज्ञ मूल्यांकन आपकी स्थिति को बेहतर समझने में मदद कर सकता है।"
        }
    },

    {
        stage: 3,
        image: "male_baldness_stage_3.png",

        en: {
            title: "Noticeable Recession",
            description:
                "Clearly visible hairline recession and mild thinning on top.",
            meaning:
                "Your selected pattern shows clearly visible hairline recession along with some thinning on the top.",
            recommendation:
                "Because visible changes are present, discussing your hair and scalp concerns with a doctor is recommended."
        },

        hi: {
            title: "स्पष्ट हेयरलाइन रीसैशन",
            description:
                "हेयरलाइन में स्पष्ट बदलाव और ऊपर की ओर हल्का पतलापन।",
            meaning:
                "आपके चुने गए पैटर्न में हेयरलाइन का स्पष्ट पीछे जाना और ऊपर की ओर कुछ पतलापन दिखाई देता है।",
            recommendation:
                "क्योंकि स्पष्ट बदलाव दिखाई दे रहे हैं, इसलिए डॉक्टर से अपने बाल और स्कैल्प संबंधी चिंता पर चर्चा करना उचित रहेगा।"
        }
    },

    {
        stage: 4,
        image: "male_baldness_stage_4.png",

        en: {
            title: "Advanced Recession & Crown Thinning",
            description:
                "Hairline has receded further and thinning at the crown is visible.",
            meaning:
                "Your selected pattern shows further hairline recession along with visible thinning around the crown.",
            recommendation:
                "A professional evaluation is recommended to understand the pattern of hair loss and determine the appropriate next steps."
        },

        hi: {
            title: "अधिक हेयरलाइन रीसैशन और क्राउन थिनिंग",
            description:
                "हेयरलाइन और पीछे गई है और क्राउन पर पतलापन दिखाई देता है।",
            meaning:
                "आपके चुने गए पैटर्न में हेयरलाइन में अधिक बदलाव और क्राउन के आसपास स्पष्ट पतलापन दिखाई देता है।",
            recommendation:
                "बाल झड़ने के पैटर्न को बेहतर समझने के लिए विशेषज्ञ मूल्यांकन उचित अगला कदम हो सकता है।"
        }
    },

    {
        stage: 5,
        image: "male_baldness_stage_5.png",

        en: {
            title: "Significant Hair Loss",
            description:
                "Noticeable thinning on the top and crown with reduced density.",
            meaning:
                "Your selected pattern shows noticeable thinning across the top and crown, with reduced hair density.",
            recommendation:
                "As visible thinning is more pronounced, consulting a doctor can help assess your individual hair and scalp concerns."
        },

        hi: {
            title: "महत्वपूर्ण बाल झड़ना",
            description:
                "ऊपर और क्राउन पर स्पष्ट पतलापन और कम घनत्व।",
            meaning:
                "आपके चुने गए पैटर्न में ऊपर और क्राउन पर स्पष्ट पतलापन तथा कम बाल घनत्व दिखाई देता है।",
            recommendation:
                "क्योंकि पतलापन अधिक स्पष्ट है, इसलिए डॉक्टर से व्यक्तिगत बाल और स्कैल्प मूल्यांकन करवाना उपयोगी हो सकता है।"
        }
    },

    {
        stage: 6,
        image: "male_baldness_stage_6.png",

        en: {
            title: "Extensive Hair Loss",
            description:
                "Severe thinning on top with limited hair remaining.",
            meaning:
                "Your selected pattern shows extensive thinning on the top with limited hair remaining in the affected area.",
            recommendation:
                "We recommend a professional consultation to assess your current hair and scalp condition and understand appropriate options."
        },

        hi: {
            title: "व्यापक बाल झड़ना",
            description:
                "ऊपर की ओर अधिक पतलापन और सीमित बाल शेष रहना।",
            meaning:
                "आपके चुने गए पैटर्न में ऊपर की ओर व्यापक पतलापन और प्रभावित हिस्से में सीमित बाल दिखाई देते हैं।",
            recommendation:
                "वर्तमान बाल और स्कैल्प की स्थिति को समझने के लिए विशेषज्ञ से परामर्श लेना उचित रहेगा।"
        }
    },

    {
        stage: 7,
        image: "male_baldness_stage_7.png",

        en: {
            title: "Advanced Hair Loss",
            description:
                "Most of the top is bald with hair remaining mainly on the sides.",
            meaning:
                "Your selected pattern shows advanced hair loss, with most of the top appearing bald and hair remaining mainly around the sides.",
            recommendation:
                "A professional consultation is strongly recommended so your current condition can be assessed individually and appropriate next steps can be discussed."
        },

        hi: {
            title: "अधिक उन्नत बाल झड़ना",
            description:
                "ऊपर का अधिकांश हिस्सा बाल रहित दिखाई देता है और मुख्यतः किनारों पर बाल रहते हैं।",
            meaning:
                "आपके चुने गए पैटर्न में ऊपर का अधिकांश हिस्सा बाल रहित दिखाई देता है और मुख्यतः किनारों पर बाल दिखाई देते हैं।",
            recommendation:
                "वर्तमान स्थिति का व्यक्तिगत मूल्यांकन करने और उचित अगले कदम समझने के लिए विशेषज्ञ से परामर्श की सलाह दी जाती है।"
        }
    }

];


/* =====================================================
   FEMALE STAGES
===================================================== */

const femaleStages = [

    {
        stage: 1,
        image: "female_hair_fall_stage_1.png",

        en: {
            title: "Mild Thinning",
            description:
                "Hair density is largely maintained, with little to no noticeable widening of the central hair part.",
            meaning:
                "Your selected pattern shows relatively maintained hair density with little visible widening of the central part.",
            recommendation:
                "Maintain a consistent hair-care routine and monitor any changes in density or hair fall."
        },

        hi: {
            title: "हल्का बाल पतलापन",
            description:
                "बालों का घनत्व काफी हद तक बना रहता है और बीच की मांग में बहुत कम या कोई स्पष्ट चौड़ापन नहीं दिखाई देता।",
            meaning:
                "आपके चुने गए पैटर्न में बालों का घनत्व काफी हद तक बना हुआ दिखाई देता है।",
            recommendation:
                "नियमित हेयर-केयर रूटीन बनाए रखें और घनत्व या बाल झड़ने में होने वाले बदलावों पर ध्यान दें।"
        }
    },

    {
        stage: 2,
        image: "female_hair_fall_stage_2.png",

        en: {
            title: "Moderate Thinning",
            description:
                "The central hair part becomes noticeably wider, with reduced hair density and increased scalp visibility.",
            meaning:
                "Your selected pattern shows a more noticeable widening of the central part with some reduction in density.",
            recommendation:
                "An early professional evaluation can help you better understand your hair and scalp condition."
        },

        hi: {
            title: "मध्यम बाल पतलापन",
            description:
                "बीच की मांग स्पष्ट रूप से चौड़ी दिखाई देने लगती है और बालों का घनत्व कम होता है।",
            meaning:
                "आपके चुने गए पैटर्न में बीच की मांग अधिक स्पष्ट रूप से चौड़ी दिखाई देती है।",
            recommendation:
                "विशेषज्ञ मूल्यांकन आपकी वर्तमान बाल और स्कैल्प स्थिति को बेहतर समझने में मदद कर सकता है।"
        }
    },

    {
        stage: 3,
        image: "female_hair_fall_stage_3.png",

        en: {
            title: "Advanced Thinning",
            description:
                "Thinning becomes more extensive across the crown and top of the scalp, with increased scalp visibility.",
            meaning:
                "Your selected pattern shows more extensive thinning across the top and crown.",
            recommendation:
                "A professional consultation is recommended to understand your individual hair and scalp concerns."
        },

        hi: {
            title: "अधिक बाल पतलापन",
            description:
                "सिर के ऊपरी और क्राउन हिस्से में बालों का पतलापन अधिक फैल जाता है।",
            meaning:
                "आपके चुने गए पैटर्न में ऊपर और क्राउन पर अधिक व्यापक पतलापन दिखाई देता है।",
            recommendation:
                "आपकी व्यक्तिगत स्थिति को समझने के लिए विशेषज्ञ से परामर्श लेना उचित रहेगा।"
        }
    },

    {
        stage: 4,
        image: "female_hair_fall_stage_4.png",

        en: {
            title: "Advanced Diffuse Thinning",
            description:
                "Hair density is significantly reduced across the top and crown, with substantial scalp visibility.",
            meaning:
                "Your selected pattern shows significant reduction in hair density across the top and crown.",
            recommendation:
                "A professional consultation is strongly recommended for an individual assessment of your hair and scalp condition."
        },

        hi: {
            title: "अधिक व्यापक बाल पतलापन",
            description:
                "ऊपर और क्राउन पर बालों का घनत्व काफी कम हो जाता है और स्कैल्प अधिक दिखाई देता है।",
            meaning:
                "आपके चुने गए पैटर्न में ऊपर और क्राउन पर बालों का घनत्व काफी कम दिखाई देता है।",
            recommendation:
                "व्यक्तिगत बाल और स्कैल्प मूल्यांकन के लिए विशेषज्ञ से परामर्श लेना उचित रहेगा।"
        }
    }

];


/* =====================================================
   QUESTIONS — MEN
===================================================== */

const menQuestions = [

    {
        en: {
            question:
                "How would you describe your current hair fall?",
            options: [
                "Very little hair fall",
                "Mild hair fall",
                "Noticeable daily hair fall",
                "Heavy hair fall"
            ]
        },

        hi: {
            question:
                "आप अपने वर्तमान बाल झड़ने को कैसे बताएंगे?",
            options: [
                "बहुत कम बाल झड़ना",
                "हल्का बाल झड़ना",
                "रोज़ाना स्पष्ट बाल झड़ना",
                "बहुत अधिक बाल झड़ना"
            ]
        }
    },

    {
        en: {
            question:
                "How much thinning have you noticed?",
            options: [
                "No visible thinning",
                "Slight thinning",
                "Noticeable thinning",
                "Significant thinning"
            ]
        },

        hi: {
            question:
                "आपने कितना बाल पतलापन महसूस किया है?",
            options: [
                "कोई स्पष्ट पतलापन नहीं",
                "हल्का पतलापन",
                "स्पष्ट पतलापन",
                "काफी अधिक पतलापन"
            ]
        }
    },

    {
        en: {
            question:
                "How has your hairline changed?",
            options: [
                "No change",
                "Slight recession",
                "Noticeable recession",
                "Significant recession"
            ]
        },

        hi: {
            question:
                "आपकी हेयरलाइन में कितना बदलाव आया है?",
            options: [
                "कोई बदलाव नहीं",
                "हल्का पीछे जाना",
                "स्पष्ट पीछे जाना",
                "काफी अधिक पीछे जाना"
            ]
        }
    },

    {
        en: {
            question:
                "How would you describe thinning at your crown?",
            options: [
                "No thinning",
                "Slight thinning",
                "Noticeable thinning",
                "Clearly visible thinning/bald area"
            ]
        },

        hi: {
            question:
                "क्राउन पर बालों के पतलेपन को आप कैसे बताएंगे?",
            options: [
                "कोई पतलापन नहीं",
                "हल्का पतलापन",
                "स्पष्ट पतलापन",
                "बहुत स्पष्ट पतलापन / बाल रहित हिस्सा"
            ]
        }
    },

    {
        en: {
            question:
                "How long have you been experiencing hair loss?",
            options: [
                "Less than 3 months",
                "3–6 months",
                "6–12 months",
                "More than 1 year"
            ]
        },

        hi: {
            question:
                "आपको बाल झड़ने की समस्या कितने समय से है?",
            options: [
                "3 महीने से कम",
                "3–6 महीने",
                "6–12 महीने",
                "1 साल से अधिक"
            ]
        }
    },

    {
        en: {
            question:
                "How has your overall hair density changed?",
            options: [
                "No noticeable change",
                "Slightly reduced",
                "Moderately reduced",
                "Significantly reduced"
            ]
        },

        hi: {
            question:
                "आपके बालों के कुल घनत्व में कितना बदलाव आया है?",
            options: [
                "कोई स्पष्ट बदलाव नहीं",
                "थोड़ा कम हुआ है",
                "मध्यम रूप से कम हुआ है",
                "काफी कम हुआ है"
            ]
        }
    },

    {
        en: {
            question:
                "Is there a family history of hair loss?",
            options: [
                "No family history",
                "One family member",
                "Multiple family members",
                "Strong family history"
            ]
        },

        hi: {
            question:
                "क्या परिवार में बाल झड़ने की समस्या का इतिहास है?",
            options: [
                "परिवार में इतिहास नहीं",
                "एक परिवार सदस्य",
                "कई परिवार सदस्य",
                "परिवार में स्पष्ट इतिहास"
            ]
        }
    }

];


/* =====================================================
   QUESTIONS — WOMEN
===================================================== */

const womenQuestions = [

    {
        en: {
            question:
                "How would you describe your current hair fall?",
            options: [
                "Very little hair fall",
                "Mild hair fall",
                "Noticeable daily hair fall",
                "Heavy hair fall"
            ]
        },

        hi: {
            question:
                "आप अपने वर्तमान बाल झड़ने को कैसे बताएंगी?",
            options: [
                "बहुत कम बाल झड़ना",
                "हल्का बाल झड़ना",
                "रोज़ाना स्पष्ट बाल झड़ना",
                "बहुत अधिक बाल झड़ना"
            ]
        }
    },

    {
        en: {
            question:
                "How much thinning have you noticed along your hair parting?",
            options: [
                "No visible thinning",
                "Slight widening",
                "Noticeable widening",
                "Significant widening with visible scalp"
            ]
        },

        hi: {
            question:
                "बीच की मांग में आपने कितना पतलापन महसूस किया है?",
            options: [
                "कोई स्पष्ट पतलापन नहीं",
                "हल्का चौड़ापन",
                "स्पष्ट चौड़ापन",
                "स्कैल्प दिखाई देने के साथ काफी चौड़ापन"
            ]
        }
    },

    {
        en: {
            question:
                "How has your overall hair density changed?",
            options: [
                "No noticeable change",
                "Slightly reduced",
                "Moderately reduced",
                "Significantly reduced"
            ]
        },

        hi: {
            question:
                "आपके बालों के कुल घनत्व में कितना बदलाव आया है?",
            options: [
                "कोई स्पष्ट बदलाव नहीं",
                "थोड़ा कम हुआ है",
                "मध्यम रूप से कम हुआ है",
                "काफी कम हुआ है"
            ]
        }
    },

    {
        en: {
            question:
                "How would you describe thinning around the crown?",
            options: [
                "No thinning",
                "Slight thinning",
                "Noticeable thinning",
                "Significant thinning"
            ]
        },

        hi: {
            question:
                "क्राउन के आसपास बालों के पतलेपन को आप कैसे बताएंगी?",
            options: [
                "कोई पतलापन नहीं",
                "हल्का पतलापन",
                "स्पष्ट पतलापन",
                "काफी अधिक पतलापन"
            ]
        }
    },

    {
        en: {
            question:
                "How long have you been experiencing hair loss?",
            options: [
                "Less than 3 months",
                "3–6 months",
                "6–12 months",
                "More than 1 year"
            ]
        },

        hi: {
            question:
                "आपको बाल झड़ने की समस्या कितने समय से है?",
            options: [
                "3 महीने से कम",
                "3–6 महीने",
                "6–12 महीने",
                "1 साल से अधिक"
            ]
        }
    },

    {
        en: {
            question:
                "Have you noticed increased hair shedding while washing or combing?",
            options: [
                "Very little",
                "Slightly more than before",
                "Clearly more than before",
                "Much more than before"
            ]
        },

        hi: {
            question:
                "बाल धोते या कंघी करते समय क्या बाल झड़ना बढ़ा है?",
            options: [
                "बहुत कम",
                "पहले से थोड़ा अधिक",
                "पहले से काफी अधिक",
                "बहुत अधिक"
            ]
        }
    },

    {
        en: {
            question:
                "What is your main hair concern?",
            options: [
                "Excessive hair fall",
                "Overall thinning",
                "Widening hair part",
                "Reduced hair density"
            ]
        },

        hi: {
            question:
                "आपकी मुख्य बालों से जुड़ी चिंता क्या है?",
            options: [
                "बहुत अधिक बाल झड़ना",
                "पूरे सिर में बाल पतले होना",
                "बीच की मांग का चौड़ा होना",
                "बालों का कुल घनत्व कम होना"
            ]
        }
    }

];


/* =====================================================
   RECENT HAIR FALL — LESS THAN 30 DAYS
===================================================== */

const recentHairFallQuestions = [

    {
        key: "diet",

        en: {
            question:
                "Have you recently made any major changes to your diet?",
            options: [
                "No major change",
                "Skipping meals or eating less",
                "Weight-loss or crash diet",
                "Major change in eating habits",
                "Not sure"
            ]
        },

        hi: {
            question:
                "क्या आपने हाल ही में अपने खान-पान में कोई बड़ा बदलाव किया है?",
            options: [
                "कोई बड़ा बदलाव नहीं",
                "खाना छोड़ना या कम खाना",
                "वजन कम करने वाली डाइट",
                "खान-पान की आदतों में बड़ा बदलाव",
                "पता नहीं"
            ]
        }
    },

    {
        key: "stress",

        en: {
            question:
                "Have stress or sleep changes been affecting you recently?",
            options: [
                "Significant stress",
                "Poor or disturbed sleep",
                "Both stress and poor sleep",
                "Neither"
            ]
        },

        hi: {
            question:
                "क्या हाल में तनाव या नींद में बदलाव का असर पड़ा है?",
            options: [
                "काफी तनाव",
                "खराब या disturbed नींद",
                "तनाव और खराब नींद दोनों",
                "दोनों में से कोई नहीं"
            ]
        }
    },

    {
        key: "illness",

        en: {
            question:
                "Have you recently had an illness, fever, or infection?",
            options: [
                "Yes",
                "No",
                "Not sure"
            ]
        },

        hi: {
            question:
                "क्या आपको हाल में बीमारी, बुखार या संक्रमण हुआ है?",
            options: [
                "हाँ",
                "नहीं",
                "पता नहीं"
            ]
        }
    },

    {
        key: "environment",

        en: {
            question:
                "Have there been any recent changes in your water, weather, or environment?",
            options: [
                "Change in water",
                "Weather or environmental change",
                "Both",
                "No major change",
                "Not sure"
            ]
        },

        hi: {
            question:
                "क्या हाल में पानी, मौसम या वातावरण में कोई बदलाव हुआ है?",
            options: [
                "पानी में बदलाव",
                "मौसम या वातावरण में बदलाव",
                "दोनों",
                "कोई बड़ा बदलाव नहीं",
                "पता नहीं"
            ]
        }
    },

    {
        key: "scalp",

        en: {
            question:
                "Have you noticed any scalp-related problems recently?",
            options: [
                "Dandruff or flaking",
                "Itching",
                "Redness or irritation",
                "Scalp bumps or acne",
                "Excessive oiliness",
                "None of these",
                "Not sure"
            ]
        },

        hi: {
            question:
                "क्या आपने हाल में स्कैल्प से जुड़ी कोई समस्या महसूस की है?",
            options: [
                "रूसी या परतें",
                "खुजली",
                "लालिमा या जलन",
                "स्कैल्प पर छोटे दाने",
                "बहुत अधिक ऑयली स्कैल्प",
                "इनमें से कोई नहीं",
                "पता नहीं"
            ]
        }
    }

];


/* =====================================================
   HELPERS
===================================================== */

function $(id) {
    return document.getElementById(id);
}


function translate(key) {
    return (
        translations[state.language]?.[key] ??
        translations.en?.[key] ??
        key
    );
}


function getLocalized(data) {
    return (
        data?.[state.language] ??
        data?.en ??
        {}
    );
}


function getCurrentStages() {
    return state.gender === "women"
        ? femaleStages
        : maleStages;
}


function getCurrentQuestions() {

    if (
        state.hairFallDuration ===
        "less30"
    ) {
        return recentHairFallQuestions;
    }

    return state.gender === "women"
        ? womenQuestions
        : menQuestions;
}


function normalizeDuration(value) {

    if (
        value === "less30" ||
        value === "less-30" ||
        value === "less_than_30_days"
    ) {
        return "less30";
    }

    if (
        value === "more30" ||
        value === "more-30" ||
        value === "more_than_30_days"
    ) {
        return "more30";
    }

    return null;
}


function showToast(message) {

    const toast = $("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(
        showToast.timer
    );

    showToast.timer =
        setTimeout(
            () => {
                toast.classList.remove("show");
            },
            2800
        );
}


/* =====================================================
   MODAL
===================================================== */

function openHairTestModal() {

    const modal =
        $("hairTestModal");

    resetAssessmentState();

    if (!modal) {
        showStep(0);
        return;
    }

    modal.classList.add(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

    showStep(0);

}


function closeHairTestModal() {

    const modal =
        $("hairTestModal");

    if (!modal) return;

    modal.classList.remove(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );
}


/* =====================================================
   LANGUAGE
===================================================== */

function applyLanguage() {

    document.documentElement.lang =
        state.language === "hi"
            ? "hi"
            : "en";


    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.getAttribute(
                    "data-i18n"
                );

            element.textContent =
                translate(key);

        });


    document
        .querySelectorAll("[data-placeholder]")
        .forEach(element => {

            const key =
                element.getAttribute(
                    "data-placeholder"
                );

            element.placeholder =
                translate(key);

        });


    document
        .querySelectorAll(".language-btn")
        .forEach(button => {

            const active =
                button.dataset.language ===
                state.language;

            button.classList.toggle(
                "active",
                active
            );

            button.setAttribute(
                "aria-pressed",
                active
                    ? "true"
                    : "false"
            );

        });



    renderStages();

    renderQuestion();

    updateQuestionButtons();

    updateStaticButtonLabels();


    if (
        $("resultStep")?.classList.contains(
            "active"
        )
    ) {
        renderResult();
    }

}


/* =====================================================
   STATIC BUTTON LABELS
===================================================== */

function updateStaticButtonLabels() {

    const next =
        $("questionNextBtn") ||
        $("nextQuestionBtn") ||
        document.querySelector(
            "[data-question-next]"
        );

    if (next) {
        next.textContent =
            translate("nextQuestion");
    }


    const back =
        $("questionBackBtn") ||
        document.querySelector(
            "[data-question-back]"
        );

    if (back) {
        back.textContent =
            translate("back");
    }


    const stageNext =
        $("stageContinueBtn") ||
        $("stageNextBtn") ||
        document.querySelector(
            "[data-stage-next]"
        );

    if (stageNext) {
        stageNext.textContent =
            translate("continue");
    }


    const photoNext =
        $("photoContinue") ||
        $("photoNextBtn") ||
        document.querySelector(
            "[data-photo-next]"
        );

    if (photoNext) {
        photoNext.textContent =
            translate("continue");
    }

}


/* =====================================================
   AGE
===================================================== */


/* =====================================================
   SUPABASE INITIALIZE
===================================================== */

function initializeSupabase() {

    if (supabaseClient) {
        return true;
    }


    if (
        !window.supabase ||
        !window.supabase.createClient
    ) {

        console.error(
            "Supabase library was not loaded."
        );

        return false;
    }


    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );


    return true;
}


/* =====================================================
   FLOW
===================================================== */

function getFlowSteps() {

    if (
        state.hairFallDuration ===
        "less30"
    ) {

        return [
            0,
            1,
            4,
            5,
            6
        ];

    }


    if (
        state.hairFallDuration ===
        "more30"
    ) {

        return [
            0,
            1,
            2,
            3,
            4,
            5,
            6
        ];

    }


    return [
        0,
        1,
        2,
        3,
        4,
        5,
        6
    ];

}


/* =====================================================
   PROGRESS
===================================================== */

function updateProgress(stepNumber) {

    const flow =
        getFlowSteps();

    const index =
        flow.indexOf(
            stepNumber
        );

    const total =
        flow.length;

    const current =
        index >= 0
            ? index + 1
            : 1;

    const percent =
        Math.round(
            (current / total) *
            100
        );


    if ($("progressLabel")) {

        $("progressLabel")
            .textContent =
            state.language === "hi"
                ? `चरण ${current} / ${total}`
                : `STEP ${current} OF ${total}`;

    }


    if ($("progressPercent")) {

        $("progressPercent")
            .textContent =
            `${percent}%`;

    }


    if ($("progressBar")) {

        $("progressBar")
            .style.width =
            `${percent}%`;

    }

}


/* =====================================================
   SHOW STEP
===================================================== */

function showStep(stepNumber) {

    document
        .querySelectorAll(
            ".test-step"
        )
        .forEach(step => {

            step.classList.toggle(
                "active",
                Number(
                    step.dataset.step
                ) ===
                Number(stepNumber)
            );

        });


    updateProgress(
        stepNumber
    );


    const modalBody =
        document.querySelector(
            ".hair-test-modal-body"
        );


    if (modalBody) {

        modalBody.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    if (
        stepNumber === 4
    ) {

        renderQuestion();

    }


    if (
        stepNumber === 6
    ) {

        renderResult();

    }

}


/* =====================================================
   GENDER
===================================================== */

function selectGender(
    gender
) {

    state.gender =
        gender;

    state.hairFallDuration =
        null;

    state.selectedStage =
        null;

    state.questionIndex =
        0;

    state.answers =
        [];

    state.recentAnswers =
        [];


    document
        .querySelectorAll(
            ".gender-card"
        )
        .forEach(card => {

            const active =
                card.dataset.gender ===
                gender;

            card.classList.toggle(
                "selected",
                active
            );

            card.setAttribute(
                "aria-pressed",
                active
                    ? "true"
                    : "false"
            );

        });


    showStep(1);

}


/* =====================================================
   DURATION
===================================================== */

function selectDuration(
    rawDuration
) {

    const duration =
        normalizeDuration(
            rawDuration
        );

    if (!duration) return;


    state.hairFallDuration =
        duration;

    state.selectedStage =
        null;

    state.questionIndex =
        0;

    state.answers =
        [];

    state.recentAnswers =
        [];


    document
        .querySelectorAll(
            ".duration-card"
        )
        .forEach(card => {

            const cardDuration =
                normalizeDuration(
                    card.dataset.duration
                );

            const active =
                cardDuration ===
                duration;

            card.classList.toggle(
                "selected",
                active
            );

            card.setAttribute(
                "aria-pressed",
                active
                    ? "true"
                    : "false"
            );

        });


    if (
        duration ===
        "less30"
    ) {

        renderQuestion();

        showStep(4);

        return;

    }


    renderStages();

    showStep(2);

}


/* =====================================================
   STAGES
===================================================== */

function renderStages() {

    const grid =
        $("stageGrid");

    if (!grid) return;


    grid.innerHTML = "";


    getCurrentStages()
        .forEach(stage => {

            const localized =
                getLocalized(
                    stage
                );


            const card =
                document.createElement(
                    "button"
                );


            card.type =
                "button";

            card.className =
                "stage-card";

            card.dataset.stage =
                String(
                    stage.stage
                );


            const selected =
                Number(
                    state.selectedStage
                ) ===
                Number(
                    stage.stage
                );


            if (selected) {

                card.classList.add(
                    "selected"
                );

            }


            card.setAttribute(
                "aria-pressed",
                selected
                    ? "true"
                    : "false"
            );


            card.innerHTML = `

                <div class="stage-image-wrap">

                    <img
                        class="stage-image"
                        src="${stage.image}"
                        alt="Stage ${stage.stage}"
                        loading="lazy"
                    >

                    <span class="stage-selected-check">
                        ✓
                    </span>

                </div>

                <div class="stage-card-body">

                    <span class="stage-label">
                        Stage ${stage.stage}
                    </span>

                    <h3>
                        ${localized.title}
                    </h3>

                    <p>
                        ${localized.description}
                    </p>

                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    state.selectedStage =
                        stage.stage;


                    grid
                        .querySelectorAll(
                            ".stage-card"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "selected"
                            );

                            item.setAttribute(
                                "aria-pressed",
                                "false"
                            );

                        });


                    card.classList.add(
                        "selected"
                    );


                    card.setAttribute(
                        "aria-pressed",
                        "true"
                    );

                }
            );


            grid.appendChild(
                card
            );

        });

}


/* =====================================================
   STAGE NEXT
===================================================== */

function bindStageNext() {

    const button =
        $("stageContinueBtn") ||
        $("stageNextBtn") ||
        document.querySelector(
            "[data-stage-next]"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();


            if (
                !state.selectedStage
            ) {

                showToast(
                    translate(
                        "selectStage"
                    )
                );

                return;

            }


            showStep(3);

        }
    );

}


/* =====================================================
   PHOTO
   OPTIONAL
===================================================== */

function resetPhotoUI() {

    const input =
        $("scalpPhoto");

    const preview =
        $("photoPreview");

    const wrap =
        $("photoPreviewWrap");

    const label =
        document.querySelector(
            ".photo-upload-label"
        );


    state.scalpPhoto =
        null;


    if (input) {
        input.value = "";
    }


    if (preview) {

        if (
            preview.dataset.objectUrl
        ) {

            URL.revokeObjectURL(
                preview.dataset.objectUrl
            );

            delete preview.dataset.objectUrl;

        }

        preview.removeAttribute(
            "src"
        );

    }


    if (wrap) {
        wrap.hidden = true;
    }


    if (label) {
        label.style.display = "";
    }

}


function bindPhoto() {

    $("scalpPhoto")
        ?.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files?.[0];

                if (!file) return;


                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    event.target.value =
                        "";

                    showToast(
                        translate(
                            "invalidPhoto"
                        )
                    );

                    return;

                }


                if (
                    file.size >
                    10 * 1024 * 1024
                ) {

                    event.target.value =
                        "";

                    showToast(
                        translate(
                            "photoTooLarge"
                        )
                    );

                    return;

                }


                state.scalpPhoto =
                    file;


                const preview =
                    $("photoPreview");

                const wrap =
                    $("photoPreviewWrap");

                const label =
                    document.querySelector(
                        ".photo-upload-label"
                    );


                if (
                    preview &&
                    wrap
                ) {

                    if (
                        preview.dataset.objectUrl
                    ) {

                        URL.revokeObjectURL(
                            preview.dataset.objectUrl
                        );

                    }


                    const objectUrl =
                        URL.createObjectURL(
                            file
                        );


                    preview.src =
                        objectUrl;

                    preview.dataset.objectUrl =
                        objectUrl;

                    wrap.hidden =
                        false;


                    if (label) {

                        label.style.display =
                            "none";

                    }

                }

            }
        );


    $("changePhotoBtn")
        ?.addEventListener(
            "click",
            event => {

                event.preventDefault();

                resetPhotoUI();

            }
        );


    const photoNext =
        $("photoContinue") ||
        $("photoNextBtn") ||
        document.querySelector(
            "[data-photo-next]"
        );


    photoNext?.addEventListener(
        "click",
        event => {

            event.preventDefault();

            /*
                PHOTO IS OPTIONAL.
                No validation here.
            */

            state.questionIndex =
                0;

            state.answers =
                [];

            renderQuestion();

            showStep(4);

        }
    );

}


/* =====================================================
   QUESTIONS
===================================================== */

function renderQuestion() {

    const questions =
        getCurrentQuestions();


    const current =
        questions[
            state.questionIndex
        ];


    if (!current) return;


    const localized =
        getLocalized(
            current
        );


    if ($("questionText")) {

        $("questionText")
            .textContent =
            localized.question;

    }


    if ($("questionCounter")) {

        $("questionCounter")
            .textContent =
            state.language === "hi"
                ? `सवाल ${state.questionIndex + 1} / ${questions.length}`
                : `QUESTION ${state.questionIndex + 1} OF ${questions.length}`;

    }


    const answerGrid =
        $("answerGrid");


    if (!answerGrid) return;


    answerGrid.innerHTML =
        "";


    localized.options
        .forEach(
            (
                option,
                index
            ) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";

                button.className =
                    "answer-btn";

                button.textContent =
                    option;


                const previousAnswer =
                    state.answers[
                        state.questionIndex
                    ];


                const selected =
                    previousAnswer &&
                    previousAnswer.index ===
                    index;


                if (selected) {

                    button.classList.add(
                        "selected"
                    );

                }


                button.setAttribute(
                    "aria-pressed",
                    selected
                        ? "true"
                        : "false"
                );


                button.addEventListener(
                    "click",
                    () => {

                        state.answers[
                            state.questionIndex
                        ] = {

                            index,

                            value:
                                option,

                            question:
                                localized.question,

                            key:
                                current.key ||
                                null

                        };


                        answerGrid
                            .querySelectorAll(
                                ".answer-btn"
                            )
                            .forEach(
                                item => {

                                    item.classList.remove(
                                        "selected"
                                    );

                                    item.setAttribute(
                                        "aria-pressed",
                                        "false"
                                    );

                                }
                            );


                        button.classList.add(
                            "selected"
                        );


                        button.setAttribute(
                            "aria-pressed",
                            "true"
                        );

setTimeout(() => {
    moveToNextQuestion();
}, 180);
                    }
                );


                answerGrid.appendChild(
                    button
                );

            }
        );


    updateQuestionButtons();

}


/* =====================================================
   QUESTION BUTTONS
===================================================== */

function updateQuestionButtons() {

    const questions =
        getCurrentQuestions();


    const answer =
        state.answers[
            state.questionIndex
        ];


    const next =
        $("questionNextBtn") ||
        $("nextQuestionBtn") ||
        document.querySelector(
            "[data-question-next]"
        );


    if (next) {

        next.textContent =
            state.questionIndex ===
            questions.length - 1

                ? translate(
                    "continue"
                )

                : translate(
                    "nextQuestion"
                );


        next.disabled =
            !answer;


        next.setAttribute(
            "aria-disabled",
            answer
                ? "false"
                : "true"
        );

    }


    const back =
        $("questionBackBtn") ||
        document.querySelector(
            "[data-question-back]"
        );


    if (back) {

        back.textContent =
            translate(
                "back"
            );

    }

}


/* =====================================================
   NEXT QUESTION
===================================================== */

function moveToNextQuestion() {

    const questions =
        getCurrentQuestions();


    if (
        !state.answers[
            state.questionIndex
        ]
    ) {

        showToast(
            translate(
                "selectAnswer"
            )
        );

        return;

    }


    if (
        state.questionIndex <
        questions.length - 1
    ) {

        state.questionIndex++;

        renderQuestion();

        return;

    }


    state.questionIndex =
        0;

    showStep(5);

}


/* =====================================================
   BACK QUESTION
===================================================== */

function moveToPreviousQuestion() {

    if (
        state.questionIndex >
        0
    ) {

        state.questionIndex--;

        renderQuestion();

        return;

    }


    if (
        state.hairFallDuration ===
        "less30"
    ) {

        showStep(1);

        return;

    }


    showStep(3);

}


/* =====================================================
   QUESTION NAVIGATION
===================================================== */

function bindQuestionNavigation() {

    const next =
        $("questionNextBtn") ||
        $("nextQuestionBtn") ||
        document.querySelector(
            "[data-question-next]"
        );


    next?.addEventListener(
        "click",
        event => {

            event.preventDefault();

            moveToNextQuestion();

        }
    );


    const back =
        $("questionBackBtn") ||
        document.querySelector(
            "[data-question-back]"
        );


    back?.addEventListener(
        "click",
        event => {

            event.preventDefault();

            moveToPreviousQuestion();

        }
    );

}


/* =====================================================
   BACK BUTTONS
===================================================== */

function bindBackButtons() {

    document
        .querySelectorAll(
            "[data-back-step]"
        )
        .forEach(
            button => {

                if (
                    button ===
                    $("questionBackBtn")
                ) {
                    return;
                }


                if (
                    button ===
                    $("leadBackBtn")
                ) {
                    return;
                }


                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();


                        const target =
                            Number(
                                button.dataset.backStep
                            );


                        if (
                            Number.isFinite(
                                target
                            )
                        ) {

                            showStep(
                                target
                            );

                        }

                    }
                );

            }
        );

}


/* =====================================================
   PHONE VALIDATION
===================================================== */

function sanitizePhone(
    value
) {

    return String(
        value || ""
    )
        .replace(
            /\D/g,
            ""
        )
        .slice(
            0,
            10
        );

}


function isValidIndianMobile(
    number
) {

    return /^[6-9]\d{9}$/
        .test(
            number
        );

}


function updatePhoneValidation() {

    const input =
        $("whatsappNumber");

    const field =
        document.querySelector(
            ".phone-field"
        );

    const message =
        $("phoneMessage");


    if (
        !input ||
        !field ||
        !message
    ) {

        return false;

    }


    const value =
        sanitizePhone(
            input.value
        );


    input.value =
        value;


    field.classList.remove(
        "valid",
        "invalid"
    );


    message.classList.remove(
        "valid",
        "invalid"
    );


    if (!value) {

        message.textContent =
            "";

        return false;

    }


    if (
        isValidIndianMobile(
            value
        )
    ) {

        field.classList.add(
            "valid"
        );

        message.classList.add(
            "valid"
        );

        message.textContent =
            `✓ ${translate(
                "validPhone"
            )}`;

        return true;

    }


    field.classList.add(
        "invalid"
    );

    message.classList.add(
        "invalid"
    );

    message.textContent =
        translate(
            "invalidPhone"
        );


    return false;

}


/* =====================================================
   LEAD FORM VALIDATION
===================================================== */

function validateLeadForm() {

    const name =
        $("fullName")
            ?.value
            .trim() ||
        "";


    const phone =
        sanitizePhone(
            $("whatsappNumber")
                ?.value ||
            ""
        );


    const age =
        $("ageGroup")
            ?.value ||
        "";


    const city =
        $("city")
            ?.value
            .trim() ||
        "";


    const consent =
        Boolean(
            $("consent")
                ?.checked
        );


    if (!name) {

        return translate(
            "nameRequired"
        );

    }


    if (
        !isValidIndianMobile(
            phone
        )
    ) {

        return translate(
            "invalidPhone"
        );

    }


    if (!age) {

        return translate(
            "ageRequired"
        );

    }


    if (!city) {

        return translate(
            "cityRequired"
        );

    }


    if (!consent) {

        return translate(
            "consentRequired"
        );

    }


    return "";

}


/* =====================================================
   LEAD BACK
===================================================== */

function bindLeadBack() {

    $("leadBackBtn")
        ?.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const questions =
                    getCurrentQuestions();


                state.questionIndex =
                    Math.max(
                        0,
                        questions.length - 1
                    );


                renderQuestion();

                showStep(4);

            }
        );

}


/* =====================================================
   SCALP PHOTO UPLOAD
===================================================== */

async function uploadScalpPhoto() {

    if (
        state.hairFallDuration !==
        "more30"
    ) {

        return null;

    }


    if (
        !state.scalpPhoto
    ) {

        return null;

    }


    if (!supabaseClient) {

        throw new Error(
            "Supabase is not initialized."
        );

    }


    const file =
        state.scalpPhoto;


    const safeName =
        file.name
            .toLowerCase()
            .replace(
                /[^a-z0-9.\-_]/g,
                "-"
            );


    const randomId =
        window.crypto?.randomUUID
            ? window.crypto.randomUUID()
            : `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`;


    const filePath =
        `${Date.now()}-${randomId}-${safeName}`;


    const result =
        await supabaseClient
            .storage
            .from(
                SCALP_BUCKET
            )
            .upload(
                filePath,
                file,
                {
                    cacheControl:
                        "3600",

                    upsert:
                        false,

                    contentType:
                        file.type
                }
            );


    if (
        result.error
    ) {

        throw result.error;

    }


    state.uploadedPhotoPath =
        result.data?.path ||
        filePath;


    return (
        state.uploadedPhotoPath
    );

}


/* =====================================================
   RESULT DATA
===================================================== */

function getStageResult() {

    return (
        getCurrentStages()
            .find(
                stage =>
                    Number(
                        stage.stage
                    ) ===
                    Number(
                        state.selectedStage
                    )
            ) ||
        null
    );

}


/* =====================================================
   RECENT FACTORS
===================================================== */

function getRecentFactors() {

    const labels = [];

    const answers =
        state.answers ||
        [];


    answers.forEach(
        (
            answer,
            index
        ) => {

            const question =
                recentHairFallQuestions[
                    index
                ];


            if (
                !question ||
                !answer
            ) {

                return;

            }


            const value =
                String(
                    answer.value ||
                    ""
                )
                    .toLowerCase();


            if (
                question.key ===
                    "diet" &&

                !value.includes(
                    "no major"
                ) &&

                !value.includes(
                    "कोई बड़ा"
                )
            ) {

                labels.push(
                    translate(
                        "recentDiet"
                    )
                );

            }


            if (
                question.key ===
                    "stress" &&

                !value.includes(
                    "neither"
                ) &&

                !value.includes(
                    "कोई नहीं"
                )
            ) {

                labels.push(
                    translate(
                        "recentStress"
                    )
                );

            }


            if (
                question.key ===
                    "illness" &&

                !value.includes(
                    "no"
                ) &&

                !value.includes(
                    "नहीं"
                )
            ) {

                labels.push(
                    translate(
                        "recentIllness"
                    )
                );

            }


            if (
                question.key ===
                    "environment" &&

                !value.includes(
                    "no major"
                ) &&

                !value.includes(
                    "कोई बड़ा"
                )
            ) {

                labels.push(
                    translate(
                        "recentEnvironment"
                    )
                );

            }


            if (
                question.key ===
                    "scalp" &&

                !value.includes(
                    "none"
                ) &&

                !value.includes(
                    "इनमें से कोई नहीं"
                )
            ) {

                labels.push(
                    translate(
                        "recentScalp"
                    )
                );

            }

        }
    );


    return [
        ...new Set(
            labels
        )
    ];

}


/* =====================================================
   SCORE
===================================================== */

function calculateAssessmentScore() {

    const answers =
        state.answers ||
        [];


    if (!answers.length) {
        return null;
    }


    if (
        state.hairFallDuration ===
        "more30"
    ) {

        const max =
            3;


        const total =
            answers.reduce(
                (
                    sum,
                    answer
                ) => {

                    return (
                        sum +
                        Math.min(
                            Number(
                                answer.index
                            ) || 0,
                            max
                        )
                    );

                },
                0
            );


        return Math.round(
            (
                total /
                (
                    answers.length *
                    max
                )
            ) *
            100
        );

    }


    const score =
        answers.reduce(
            (
                sum,
                answer,
                index
            ) => {

                const question =
                    recentHairFallQuestions[
                        index
                    ];


                const max =
                    Math.max(
                        (
                            question
                                ?.en
                                ?.options
                                ?.length ||
                            1
                        ) - 1,
                        1
                    );


                return (
                    sum +
                    (
                        (
                            Number(
                                answer.index
                            ) || 0
                        ) /
                        max
                    ) *
                    100
                );

            },
            0
        ) /
        answers.length;


    return Math.round(
        score
    );

}


/* =====================================================
   RESULT RENDER
===================================================== */

function renderFactors() {

    const list =
        $("factorList");

    if (!list) return;


    list.innerHTML =
        "";


    const factors =
        getRecentFactors();


    if (!factors.length) {

        const chip =
            document.createElement(
                "span"
            );

        chip.className =
            "factor-chip";

        chip.textContent =
            translate(
                "noFactor"
            );

        list.appendChild(
            chip
        );

        return;

    }


    factors.forEach(
        factor => {

            const chip =
                document.createElement(
                    "span"
                );

            chip.className =
                "factor-chip";

            chip.textContent =
                factor;

            list.appendChild(
                chip
            );

        }
    );

}


/* =====================================================
   WHATSAPP
===================================================== */

function getWhatsAppUrl() {

    const name =
        $("fullName")
            ?.value
            .trim() ||
        "Patient";


    const city =
        $("city")
            ?.value
            .trim() ||
        "";


    const gender =
        state.gender ===
        "women"
            ? "Women"
            : "Men";


    const duration =
        state.hairFallDuration ===
        "less30"
            ? "Less than 30 days"
            : "More than 30 days";


    const result =
        getStageResult();


    let stageLine =
        "Selected Stage: Not applicable for less than 30 days";


    if (
        state.hairFallDuration ===
        "more30" &&
        result
    ) {

        stageLine =
            `Selected Stage: Stage ${result.stage} — ${getLocalized(result).title}`;

    }


    const message = [

        "Hello Clinica Medicare,",

        "",

        "I have completed the 2-Minute Hair Assessment.",

        "",

        `Name: ${name}`,

        `Gender: ${gender}`,

        `Hair Fall Duration: ${duration}`,

        stageLine,

        `City: ${city}`,

        "",

        "I would like to know more about the ₹150 consultation."

    ].join("\n");


    return (
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    );

}


function updateWhatsAppLink() {

    const url =
        getWhatsAppUrl();


    const button =
        $("consultationBtn");


    if (button) {

        button.dataset.whatsappUrl =
            url;


        if (
            button.tagName ===
            "A"
        ) {

            button.href =
                url;

            button.target =
                "_blank";

            button.rel =
                "noopener noreferrer";

        }

    }


    return url;

}


/* =====================================================
   RESULT
===================================================== */

function renderResult() {

    const recent =
        state.hairFallDuration ===
        "less30";


    const stageVisual =
        $("resultStageVisual");


    const recentContent =
        $("recentResultContent");


    const stageContent =
        $("stageResultContent");


    const resultImage =
        $("resultImage");


    const resultStage =
        $("resultStage");


    const resultTitle =
        $("resultTitle");


    const resultType =
        $("resultType");


    /* -----------------------------------------------
       LESS THAN 30 DAYS
    ----------------------------------------------- */

    if (recent) {

        if (stageVisual) {

            stageVisual.style.display =
                "none";

        }


        if (stageContent) {

            stageContent.style.display =
                "none";

        }


        if (recentContent) {

            recentContent.hidden =
                false;

        }


        if (resultTitle) {

            resultTitle.textContent =
                state.language ===
                "hi"

                    ? "हाल के बाल झड़ने का मूल्यांकन"

                    : "Recent Hair Fall Assessment";

        }


        if (resultType) {

            resultType.textContent =
                state.language ===
                "hi"

                    ? "30 दिनों से कम"

                    : "Less than 30 days";

        }


        renderFactors();

        updateWhatsAppLink();

        return;

    }


    /* -----------------------------------------------
       MORE THAN 30 DAYS
    ----------------------------------------------- */

    if (recentContent) {

        recentContent.hidden =
            true;

    }


    if (stageVisual) {

        stageVisual.style.display =
            "";

    }


    if (stageContent) {

        stageContent.style.display =
            "";

    }


    const result =
        getStageResult();


    if (!result) return;


    const localized =
        getLocalized(
            result
        );


    if (resultImage) {

        resultImage.src =
            result.image;

        resultImage.alt =
            `${localized.title} - Stage ${result.stage}`;

    }


    if (resultStage) {

        resultStage.textContent =
            state.language ===
            "hi"

                ? `चरण ${result.stage}`

                : `Stage ${result.stage}`;

    }


    if (resultTitle) {

        resultTitle.textContent =
            localized.title;

    }


    if (resultType) {

        resultType.textContent =
            state.gender ===
            "women"

                ? (
                    state.language ===
                    "hi"

                        ? "महिला पैटर्न हेयर थिनिंग"

                        : "Female Pattern Hair Thinning"
                )

                : (
                    state.language ===
                    "hi"

                        ? "पुरुष पैटर्न हेयर लॉस"

                        : "Male Pattern Hair Loss"
                );

    }


    if ($("resultSummaryText")) {

        $("resultSummaryText")
            .textContent =
            localized.meaning;

    }


    if ($("resultMeaningText")) {

        $("resultMeaningText")
            .textContent =

            state.language ===
            "hi"

                ? "यह ऑनलाइन मूल्यांकन आपके चुने गए स्टेज और दिए गए उत्तरों के आधार पर एक प्रारंभिक संकेत देता है। यह क्लिनिकल डायग्नोसिस नहीं है।"

                : "This online assessment provides an initial indication based on your selected stage and responses. It is not a clinical diagnosis.";

    }


    if ($("resultRecommendationText")) {

        $("resultRecommendationText")
            .textContent =
            localized.recommendation;

    }


    /*
       Every >30 days stage result gets
       the same ₹150 consultation CTA.
    */

    const consultationButton =
        $("consultationBtn");


    if (consultationButton) {

        consultationButton.dataset.consultationFee =
            "150";

    }


    updateWhatsAppLink();

}


/* =====================================================
   SAVE ASSESSMENT
   ONE INSERT ONLY
===================================================== */

async function saveAssessment() {

    if (!supabaseClient) {

        throw new Error(
            "Supabase is not initialized."
        );

    }


    let uploadedPhoto =
        null;


    /*
       PHOTO IS OPTIONAL.

       If photo upload fails,
       assessment will STILL be saved.
    */

    if (
        state.hairFallDuration ===
            "more30" &&
        state.scalpPhoto
    ) {

        try {

            uploadedPhoto =
                await uploadScalpPhoto();

        } catch (
            photoError
        ) {

            console.warn(
                "Scalp photo upload failed. Continuing without photo.",
                photoError
            );

            uploadedPhoto =
                null;

            state.uploadedPhotoPath =
                null;

        }

    }


    const fullName =
        $("fullName")
            ?.value
            .trim() ||
        "";


    const phone =
        sanitizePhone(
            $("whatsappNumber")
                ?.value ||
            ""
        );


    const age =
        $("ageGroup")
            ?.value ||
        "";


    const city =
        $("city")
            ?.value
            .trim() ||
        "";


    const recent =
        state.hairFallDuration ===
        "less30";


    const stageResult =
        getStageResult();


    const flowType =
        recent
            ? "less_than_30_days"
            : "more_than_30_days";


    const assessmentResult =
        recent

            ? (
                state.language ===
                "hi"

                    ? "प्रारंभिक स्टेज / 30 दिनों से कम"

                    : "Early Stage / Less Than 30 Days"
            )

            : (
                stageResult

                    ? `Stage ${stageResult.stage} — ${getLocalized(stageResult).title}`

                    : "Stage assessment"
            );


    const recentFactors =
        recent
            ? getRecentFactors()
            : [];


    const answersPayload = {

        language:
            state.language,

        gender:
            state.gender,

        hair_fall_duration:
            flowType,

        selected_stage:
            recent
                ? null
                : state.selectedStage,

        recent_factors:
            recentFactors,

        answers:
            state.answers

    };


    const payload = {

        full_name:
            fullName,

        whatsapp_number:
            phone,

        age_group:
            age,

        city:
            city,

        gender:
            state.gender,

        selected_stage:

            recent ||
            !state.selectedStage

                ? null

                : `Stage ${state.selectedStage}`,

      

        answers:
            answersPayload,

        scalp_photo:
            uploadedPhoto,

        consent:
            true,

        main_concern:

            recent

                ? (
                    recentFactors.length

                        ? recentFactors.join(
                            ", "
                        )

                        : "Recent hair fall"
                )

                : (
                    stageResult

                        ? getLocalized(
                            stageResult
                        ).title

                        : "Hair thinning / hair loss"
                ),

        flow_type:
            flowType,

        hair_fall_duration:
            flowType,

        assessment_result:
            assessmentResult,

        pdf_downloaded:
            false,

        consultation_requested:
            false

    };


    /*
       IMPORTANT:

       Do NOT use:

       .select("id")

       because public SELECT policy may not exist.

       This is a clean INSERT-only flow.
    */

    const {
        error
    } =
        await supabaseClient
            .from(
                "hair_assessment"
            )
            .insert(
                payload
            );


    if (error) {

        throw error;

    }


    state.lastSubmissionId =
        null;


    return true;

}


/* =====================================================
   LEAD SUBMIT
===================================================== */

async function handleLeadSubmit(
    event
) {

    event.preventDefault();


    if (
        state.isSaving
    ) {

        return;

    }


    const error =
        validateLeadForm();


    if (error) {

        if ($("formError")) {

            $("formError")
                .textContent =
                error;

        }

        return;

    }


    if ($("formError")) {

        $("formError")
            .textContent =
            "";

    }


    if (
        !initializeSupabase()
    ) {

        if ($("formError")) {

            $("formError")
                .textContent =
                "Supabase could not be initialized.";

        }

        return;

    }


    state.isSaving =
        true;


    const button =
        $("submitLeadBtn");


    const originalText =
        button?.innerHTML ||
        "";


    if (button) {

        button.disabled =
            true;

        button.innerHTML =
            `<span>${translate(
                "saving"
            )}</span>`;

    }


    try {

        await saveAssessment();

        renderResult();

        showStep(6);

    } catch (error) {

        console.error(
            "Assessment save error:",
            error
        );


        if ($("formError")) {

            $("formError")
                .textContent =
                translate(
                    "saveError"
                );

        }

    } finally {

        state.isSaving =
            false;


        if (button) {

            button.disabled =
                false;

            button.innerHTML =
                originalText;

        }

    }

}


/* =====================================================
   PDF DOWNLOAD
===================================================== */

async function downloadHairPlan() {

    const filename =

    "Clinica Medicare Diet Plan for 30 Days.pdf";


    try {

        const response =
            await fetch(
                HAIR_PLAN_URL,
                {
                    mode:
                        "cors",

                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `PDF download failed: ${response.status}`
            );

        }


        const blob =
            await response.blob();


        const blobUrl =
            URL.createObjectURL(
                blob
            );


        const anchor =
            document.createElement(
                "a"
            );


        anchor.href =
            blobUrl;

        anchor.download =
            filename;

        anchor.rel =
            "noopener";


        document.body.appendChild(
            anchor
        );


        anchor.click();


        anchor.remove();


        setTimeout(
            () => {

                URL.revokeObjectURL(
                    blobUrl
                );

            },
            5000
        );


    } catch (error) {

        console.warn(
            "Named PDF download fallback:",
            error
        );


        window.open(
            HAIR_PLAN_URL,
            "_blank",
            "noopener,noreferrer"
        );

    }

}


/* =====================================================
   CONSULTATION
===================================================== */

function bindConsultation() {

    $("consultationBtn")
        ?.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const url =
                    getWhatsAppUrl();


                window.open(
                    url,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

}


/* =====================================================
   PLAN BUTTON
===================================================== */

function bindPlanDownload() {

    $("downloadPlanBtn")
        ?.addEventListener(
            "click",
            async event => {

                event.preventDefault();

                await downloadHairPlan();

            }
        );

}


/* =====================================================
   MODAL BINDING
===================================================== */

function bindModal() {
    const startButton = $("startHairTest");

    if (startButton) {
        startButton.addEventListener("click", event => {
            event.preventDefault();

            resetAssessmentState();
            openHairTestModal();
            showStep(0);
        });
    }

    const viewPlanButton = $("viewPlanBtn");

    if (viewPlanButton) {
        viewPlanButton.addEventListener("click", event => {
            event.preventDefault();

            resetAssessmentState();
            openHairTestModal();
            showStep(0);
        });
    }

    ["closeHairTestModal", "closeHairTest"].forEach(id => {
        $(id)?.addEventListener("click", event => {
            event.preventDefault();
            closeHairTestModal();
        });
    });

    document.querySelectorAll("[data-modal-close]").forEach(element => {
        element.addEventListener("click", event => {
            event.preventDefault();
            closeHairTestModal();
        });
    });

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            $("hairTestModal")?.classList.contains("active")
        ) {
            closeHairTestModal();
        }
    });
}



/* =====================================================
   HERO VIDEO
===================================================== */

function bindHeroVideo() {

    const heroVideo =
        $("heroVideo");


    const playButton =
        $("videoPlayIndicator");


    const playIcon =
        $("videoPlayIcon");


    playButton?.addEventListener(
        "click",
        () => {

            if (!heroVideo) {
                return;
            }


            if (
                heroVideo.paused
            ) {

                heroVideo
                    .play()
                    .catch(
                        () => {}
                    );

            } else {

                heroVideo.pause();

            }

        }
    );


    heroVideo?.addEventListener(
        "play",
        () => {

            if (playIcon) {

                playIcon.textContent =
                    "Ⅱ";

            }

        }
    );


    heroVideo?.addEventListener(
        "pause",
        () => {

            if (playIcon) {

                playIcon.textContent =
                    "▶";

            }

        }
    );

}


/* =====================================================
   RESTART
===================================================== */

function bindRestart() {

    $("restartTestBtn")
        ?.addEventListener(
            "click",
            event => {

                event.preventDefault();

                resetAssessmentState();

                showStep(0);

            }
        );

}


/* =====================================================
   RESET
===================================================== */

function resetAssessmentState() {

    state.gender =
        null;

    state.hairFallDuration =
        null;

    state.selectedStage =
        null;

    state.questionIndex =
        0;

    state.answers =
        [];

    state.recentAnswers =
        [];

    state.scalpPhoto =
        null;

    state.uploadedPhotoPath =
        null;

    state.lastSubmissionId =
        null;

    state.isSaving =
        false;


    document
        .querySelectorAll(
            ".gender-card, .duration-card, .stage-card"
        )
        .forEach(
            card => {

                card.classList.remove(
                    "selected"
                );

                card.setAttribute(
                    "aria-pressed",
                    "false"
                );

            }
        );


    resetPhotoUI();


    const leadForm =
        $("leadForm");


    if (leadForm) {

        leadForm.reset();

    }


    if ($("formError")) {

        $("formError")
            .textContent =
            "";

    }


    updatePhoneValidation();


    if ($("resultStageVisual")) {

        $("resultStageVisual")
            .style.display =
            "";

    }


    if ($("stageResultContent")) {

        $("stageResultContent")
            .style.display =
            "";

    }


    if ($("recentResultContent")) {

        $("recentResultContent")
            .hidden =
            true;

    }

    renderStages();

    renderQuestion();

    updateStaticButtonLabels();

}


/* =====================================================
   LANGUAGE BUTTONS
===================================================== */

function bindLanguage() {

    document
        .querySelectorAll(
            ".language-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const language =
                            button.dataset.language;


                        if (
                            !language ||
                            !translations[
                                language
                            ] ||
                            language ===
                            state.language
                        ) {

                            return;

                        }


                        state.language =
                            language;


                        applyLanguage();

                    }
                );

            }
        );

}


/* =====================================================
   GENDER BIND
===================================================== */

function bindGender() {

    document
        .querySelectorAll(
            ".gender-card"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        selectGender(
                            card.dataset.gender
                        );

                    }
                );

            }
        );

}


/* =====================================================
   DURATION BIND
===================================================== */

function bindDuration() {

    document
        .querySelectorAll(
            ".duration-card"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        selectDuration(
                            card.dataset.duration
                        );

                    }
                );

            }
        );

}


/* =====================================================
   INITIALIZE
===================================================== */

function initHairAssessment() {

    initializeSupabase();


    bindModal();

    bindGender();

    bindDuration();

    bindStageNext();

    bindPhoto();

    bindQuestionNavigation();

    bindBackButtons();

    bindLeadBack();

    bindPlanDownload();

    bindConsultation();

    bindHeroVideo();

    bindRestart();

    bindLanguage();


    $("leadForm")
        ?.addEventListener(
            "submit",
            handleLeadSubmit
        );


    $("whatsappNumber")
        ?.addEventListener(
            "input",
            updatePhoneValidation
        );


    applyLanguage();

    resetAssessmentState();

    showStep(0);

}


/* =====================================================
   DOM READY
===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initHairAssessment,
        {
            once: true
        }
    );

} else {

    initHairAssessment();

}