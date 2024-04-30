import { StateTimer } from './js/StateTimer.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.17/+esm';


console.log(global_config);
var state_timer = new StateTimer(Tone.context, global_config);
state_timer.init();
var current_index = 0;
var max_range = 8;
var current_test = "no-test";
var test_index = 0;
var is_testing =false ;
var single_set_questions_total_num = 16;

var gui = new GUI();

var folder0 = gui.addFolder('Basic Setting');

var mode_folder = gui.addFolder('Mode Setting');

var test_folder = gui.addFolder('Test Setting');

var actual_test_folder = gui.addFolder('Actual Test Setting');


function prepare_the_output_data(){
        // use adjax to construst and send data to backend
        var current_subject_index = global_config.subject_index;
        var current_test_type = global_config.test_type;
        // create an empty array the ready 
        var data_to_send = [];
        var subject_identifier = global_config.subject_identifier;
        console.log(config);
        // loop through all the answers in the config
        for (var i = 0; i < config.length; i++) {
            // get the answer
            var answer = config[i].answer;
            var single_data = {
                "subject_index": current_subject_index,
                "data_index": config[i].data_index,
                "question_id":config[i].question_id,
    
                //"test_type": config[i].type,
                //"test_content": config[i].content,
                "answer": config[i].answer
            }
            data_to_send.push(single_data);
    
    
            // looping the 
        }
        return data_to_send;
    
}

function save_data_to_backend() {


    var output_data = prepare_the_output_data();
    
    save_the_answer(output_data);

    // send data to backend without jquery

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/exp/"+global_config.subject_identifier, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(output_data));

}

global_data_save = save_data_to_backend;



const all_conditions = [
    'pitch',
    'spatial'
]

test_folder.close();

function update_test(input_test_name) {
    current_index = 0;
    current_test = input_test_name;
    update_gui();

}

function update_gui() {
    document.getElementById("test_index").innerHTML = current_index;
    document.getElementById("test_index").style.color = "green";
    document.getElementById("test_method").innerHTML = current_test;
    document.getElementById("test_method").style.color = "blue";
}


test_folder.add(global_config, 'current_test', ['single_linear', 'single_cycle', 'single_pulse', 'double_linear', 'double_cycle', 'double_pulse']).name('Dataset').onChange(value => {
    console.log("current dataset", value);
    global_config.test_type = value;

    state_timer.update_config(global_config);
    state_timer.random_graph();

    update_test(value);


})



actual_test_folder.add(global_config, 'subject_identifier', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).name('Subject Identifier').onChange(value => {

    console.log("choose the method");

})


// actual_test_folder.add(global_config, 'subject_index', [0, 1, 2, 3]).name('Subject Index').onChange(value => {

//     console.log(value);

// })

actual_test_folder.add(global_config, 'the_test_order', [0, 1, 2, 3, 4, 5]).name('Test Order').onChange(value => {

    if (value == 0) {
        config = overall_test(0, 4, ["pitch", "spatial"]);
    } else if (value == 1) {
        config = overall_test(0, 4, ["pitch", "spatial"]);
    } else if (value == 2) {
        config = overall_test(0, 4, ["spatial", "pitch"]);
    } else if (value == 3) {
        config = overall_test(0, 4, ["spatial", "pitch"]);
    } else if (value == 4) {
        config = overall_test(0, 4, ["pitch", "spatial"]);
    } else if (value == 5) {
        config = overall_test(0, 4, [ "spatial", "pitch"]);
    }

    console.log(config);



    // }
    update_gui();




})

var hide_display=false;
// add a button to the folder actual_test_folder
var generate_function = {
    add: function () {

        console.log("clicked")
        const source = document.getElementById("entry-template").innerHTML;
        const template = Handlebars.compile(source);
        //document.getElementById("main_control_pannel").style.display = "none";

        document.getElementById("main").innerHTML = template({ config: config[index] });



        var value = config[0].test_content;

        console.log("current dataset", value);
        global_config.test_type = value;

        current_index = config[0].data_index + 1 + 4 * global_config.subject_index+4*Math.floor(index/single_set_questions_total_num);
        current_test = value;

        state_timer.load_value_of_index(current_index, current_test);
        document.getElementById("test_index").innerHTML = current_index;

        save ();

        previous ();

        update_gui();
        actual_test_folder.close();

        document.getElementById("training_panel").style.display = "block";
        document.getElementById("main").style.display = "none";


    },

    save: function () {
        save_data_to_backend();
    },

    hide: function(){
        if (hide_display==false){
            document.getElementById("all_vis").style.display = "none";
            hide_display=true;
        }else{
            document.getElementById("all_vis").style.display = "block";
            hide_display=false;
        }
    }
}

actual_test_folder.add(global_config.audio_config, 'dataset', ['default']).name('Dataset').onChange(value => {
    console.log("current dataset", value);
    state_timer.update_config(global_config);
    state_timer.update_database(value);
});



actual_test_folder.add(generate_function, 'add').name('Press to Load Test');

//actual_test_folder.add(generate_function, 'save').name('SAVE DATA');

//actual_test_folder.add(generate_function, 'hide').name('HIDE VIS');


test_folder.add(global_config, 'test_method', ['pitch', 'spatial']).name('Test Method').onChange(value => {

    console.log("choose the method");

})





//var get_random_value_function = state_timer.random_graph.bind(state_timer);


mode_folder.add(global_config, 'test_type', ['default', 'single_linear', 'single_cycle', 'single_pulse', 'double_linear', 'double_cycle', 'double_pulse']).name('Dataset').onChange(value => {
    console.log("current dataset", value);
    state_timer.update_config(global_config);

    state_timer.random_graph();


});





mode_folder.add(global_config, 'noise_level', 0, 0.2).step(0.05).name('NOISE LEVEL').onFinishChange(value => {
    global_config.noise_level = value;
    state_timer.update_config(global_config);
    state_timer.random_graph();
});


mode_folder.add(global_config, 'unit_based_sample_play').name('unit_based_sample_play').onFinishChange(value => {
    global_config.unit_based_sample_play = value;
    console.log("unit_based_sample_play changed", value);
    state_timer.update_config(global_config);
})



mode_folder.add(global_config, 'value_mode').name('value_mode').onFinishChange(value => {
    if (value) {

        //global_config.unit_based_sample_play = false;
        console.log("unit_based_sample_play changed", false);
        global_config.audio_config.pitchnpan_interval = 5;
    }
    state_timer.update_config(global_config);
})



//mode_folder.add({ add: get_random_value_function }, 'add').name('Get Random New Value');


mode_folder.hide();

folder0.close();

// add a button to the folder 





//create a function to randomly retrive a function 




folder0.add(global_config, 'time_duration', 10, 120).step(1).name('SCALE DETAILS').onFinishChange(value => {
    global_config.time_duration = value;
    state_timer.update_config(global_config);
});

folder0.add(global_config.audio_config, 'pitchnpan_interval', 0.125, 8).step(0.1).name('SAMPLE ALLOW TIME').onFinishChange(value => {
    global_config.audio_config.pitchnpan_interval = value;
    state_timer.update_config(global_config);
});


fetch('./res/configs.json')
    .then((response) => response.json())
    .then((data) => {
        var config_name_list = [];
        for (var i = 0; i < data.length; i++) {
            config_name_list.push(data[i].name);
        }
        folder0.add(global_config, 'encoding_method', config_name_list).name('Encoding Method').onChange(value => {


            var index = data.findIndex(p => p.name == value);
            console.log("update data", data[index].data);
            global_config = data[index].data;
            state_timer.update_config(global_config);

            //state_timer.update_database(value);
        });


    });


var advanced_folder = gui.addFolder('Advanced Setting');

var folder1 = advanced_folder.addFolder('General');
advanced_folder.close();
console.log(global_config);

// initially folder is closed

folder1.close();

folder1.add(global_config.audio_config, 'mode', ['percnrepeat', 'pitchpoly', 'pitchnpan', 'spatial', 'percnpan', 'spatial_simple', 'spatial_explore']).name('Mode').onChange(value => {
    global_config.audio_config.mode = value;
    state_timer.update_config(global_config);
});

folder1.add(global_config, 'time_duration', 10, 60).step(1).name('Time Duration').onFinishChange(value => {
    global_config.time_duration = value;
    state_timer.update_config(global_config);
});

folder1.add(global_config, 'dynamic_scale', 0.5, 3).step(1).name('Scale').onFinishChange(value => {
    global_config.dynamic_scale = value;
    state_timer.update_config(global_config);
});

folder1.add(global_config, 'radius', 0.5, 3).step(0.25).name('Radius').onFinishChange(value => {
    global_config.radius = value;
    state_timer.update_config(global_config);
});

folder1.add(global_config, 'theta', Math.PI / 6, 2 * Math.PI).step(0.01).name('Theta').onFinishChange(value => {
    global_config.theta = value;
    state_timer.update_config(global_config);
});

folder1.add(global_config.audio_config, 'pitchnpan_interval', 0.05, 8).step(0.1).name('Interval').onFinishChange(value => {
    global_config.audio_config.pitchnpan_interval = value;
    state_timer.update_config(global_config);
});

folder1.add(global_config.audio_config, 'voice_over', 'voice_over').onFinishChange(value => {
    global_config.audio_config.voice_over = value;
    state_timer.update_config(global_config);
})


folder1.add(global_config.audio_config, 'switch_real_samples', 'switch_real_samples').onFinishChange(value => {
    global_update_config.audio_config.switch_real_samples = value;
    state_timer.update_config(global_config);
})

folder1.add(global_config.audio_config, 'reference_timeline', 'reference_timeline').onFinishChange(value => {
    global_config.audio_config.reference_timeline = value;
    state_timer.update_config(global_config);
})


//var spectrum_display = folder1.add(global_config, 'spectrum_display').name('Spectrum Display');

var audio_config_folder = advanced_folder.addFolder('Audio Config');
audio_config_folder.close();
//var location_config = audio_config_folder.addFolder('Location');
var synths_folder = audio_config_folder.addFolder('Synths');
var audio_location_folder = audio_config_folder.addFolder('Audience Location');

audio_location_folder.add(global_config.audio_config.audience_location, 'pitch', -1, 1).step(0.05).name('X').onFinishChange(value => {
    global_config.audio_config.audience_location.pitch = value;
    console.log("changed pitch")
    state_timer.update_config(global_config);
})

audio_location_folder.add(global_config.audio_config.audience_location, 'yaw', -1, 1).step(0.05).name('Y').onFinishChange(value => {
    global_config.audio_config.audience_location.yaw = value;
    state_timer.update_config(global_config);
})

audio_location_folder.add(global_config.audio_config.audience_location, 'roll', -1, 1).step(0.05).name('Z').onFinishChange(value => {
    global_config.audio_config.audience_location.roll = value;
    state_timer.update_config(global_config);
})




global_config.audio_config.audio_channels.forEach((trem, i) => {

    var single_channel = synths_folder.addFolder('Channel  ' + i);
    var osc_type = single_channel.addFolder('OSC Type');

    osc_type.add(global_config.audio_config.audio_channels[i].synth.oscillator, 'type', ['sine', 'square', 'triangle', 'sawtooth']).name('OSC').onFinishChange(value => {
        global_config.audio_config.audio_channels[i].synth.oscillator.type = value;
        console.log(value);
        state_timer.update_config(global_config);
    })

    var sub_folder = single_channel.addFolder('Tremolo Effect');
    sub_folder.add(global_config.audio_config.audio_channels[i].tremolo_effect, 'frequency', 0, 8).step(1).name('Frequency').onFinishChange(value => {
        global_config.audio_config.audio_channels[i].tremolo_effect.frequency = value;
        state_timer.update_config(global_config);
    })
    sub_folder.add(global_config.audio_config.audio_channels[i].tremolo_effect, 'depth', 0, 1).step(0.1).name('Depth').onFinishChange(value => {
        global_config.audio_config.audio_channels[i].tremolo_effect.depth = value;
        state_timer.update_config(global_config);
    })

    sub_folder.add(global_config.audio_config.audio_channels[i], 'mute').name('Mute').onFinishChange(value => {
        global_config.audio_config.audio_channels[i].mute = value;
        console.log("mute changed", value);
        state_timer.update_config(global_config);
    })

    if (i == 1) {
        folder0.add(global_config.audio_config.audio_channels[i], 'mute').name('Solo On One set of Data').onFinishChange(value => {
            global_config.audio_config.audio_channels[i].mute = value;
            state_timer.update_config(global_config);
        })
    }

})


function global_update_config() {
    //console.log("global update config");
    state_timer.update_pan(global_config);

}

update_global_config = global_update_config;

play_function = state_timer.start.bind(state_timer);
stop_function = state_timer.stop.bind(state_timer);


function update_test_data_selection(training_config_info) {
    console.log(training_config_info);

    console.log("passed succesful, dataset value is: ", training_config_info.test_content);
    //split string with _ and get the last element
    var value = training_config_info.test_content;

    console.log("current dataset", value);
    global_config.test_type = value;

    current_index = training_config_info.data_index + 1 + 4 * global_config.subject_index+4*Math.floor(index/single_set_questions_total_num);;
    current_test = value;

    state_timer.load_value_of_index(current_index, current_test);
    document.getElementById("test_index").innerHTML = current_index;
    

    console.log("current index", current_index%single_set_questions_total_num);



    // }
    update_gui();

    // state_timer.update_config(global_config);
    // state_timer.random_graph();

}

simple_update_test_data_selection = update_test_data_selection;


function next_text(){
    var test_list = ['default']
    if (test_index < test_list.length){
        state_timer.update_database(test_list[test_index]);
        test_index = test_index + 1;
    }else{
        console.log("test complete");
        document.getElementById("start_value").style.display = "block";
    }

}

function start_test(){
    // hide the visulization and display
    //generate_function.hide();
    //hide the start test button
    document.getElementById("training_panel").style.display = "none";
    document.getElementById("main").style.display = "block";
    state_timer.load_value_of_index(current_index, current_test);

}


document.getElementById("start").onclick = state_timer.start.bind(state_timer);
document.getElementById("pitch").onchange = () => {
    console.log('it changed'); // Do something
}
document.getElementById("stop").onclick = state_timer.stop.bind(state_timer);
document.getElementById("single_value").onclick = next_text;
document.getElementById("start_value").onclick = start_test;





function load_next_text_graph() {
    current_index = current_index + 1;
    if (current_index <= max_range) {

        console.log("current index", current_index);
        state_timer.load_value_of_index(current_index, current_test);
        document.getElementById("test_index").innerHTML = current_index;
    } else {
        console.log("complete_cycle", current_index);
    }
}


function updated_method () {
    console.log("updated method");

    // sleep for 1 second

    var input_method = config[index].condition;

    console.log("input method", input_method);
    console.log("current index", index);
    console.log(config);

    console.log("current reminder", index%single_set_questions_total_num );





    switch (input_method) {
        case "pitch":
            console.log("pitch");
            // global_config.audio_config.mode = value;
            // state_timer.update_config(global_config);
            state_timer.config.audio_config.mode= "pitchnpan";
            break;
        case "spatial":
            console.log("spatial");
            state_timer.config.audio_config.mode = "percnpan";
            break;
        case "tempo":
            console.log("tempo");
            state_timer.config.audio_config.mode = "percnrepeat";
            break;
    }

    if (index%single_set_questions_total_num == 0){
        console.log("change method");
        document.getElementById("training_panel").style.display = "block";
        document.getElementById("main").style.display = "none";
        initialize_test_index();

    }

    //state_timer.update_config(global_config);
}

function initialize_test_index(){
    test_index = 0;
    //load test data
    state_timer.update_database("default");
    //hide the button of start test
    document.getElementById("start_value").style.display = "none";
}
function delay_run() {
    console.log("delay run");
    setTimeout(function () {
        console.log("delay run 2");

            updated_method();
    }, 50);
}



global_update_method =  delay_run;


