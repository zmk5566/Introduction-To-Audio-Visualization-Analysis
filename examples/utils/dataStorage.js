var global_config = 
{
      "time_duration": 30,
      "test_type": "standby",
      "noise_level": 0,
      "subject_index": 0,
      "test_method":"spatial",
      "the_test_order":0,
      "spectrum_display": false,
      "subject_identifier":-1,
      "data_types_num": 3,
      "dynamic_scale": 2,
      "value_mode":false,
      "radius": 1,
      "current_test":"no-test",
      "theta": 2.09439510239,
      "unit_based_sample_play":true,
      "test_mode": "test_mode",
      "is_testing": false,
      "encoding_method":"TIME-PAN-(PERC-SEQ)",
      "audio_config": {
        "voice_over": false,
        "audience_location": {
          "pitch": 0,
          "yaw": 0,
          "roll": 0
        },
        "mode": "percnpan",
        "dataset": "default",
        "voice_over_time": 1,
        "pitchnpan_interval": 1,
        "reference_timeline": false,
        "switch_real_samples": false,
        "audio_channels": [
          {
            "synth_index": 0,
            "mute": false,
            "synth": {
              "oscillator": {
                "type": "triangle"
              },
              "envelope": {
                "attack": 0,
                "decay": 0,
                "sustain": 0.01,
                "release": 0.1
              }
            },
            "tremolo_effect": {
              "frequency": 0,
              "depth": 0
            }
          },
          {
            "synth_index": 1,
            "mute": false,
            "synth": {
              "oscillator": {
                "type": "sawtooth"
              },
              "envelope": {
                "attack": 0,
                "decay": 0,
                "sustain": 0.01,
                "release": 0.1
              }
            },
            "tremolo_effect": {
              "frequency": 0,
              "depth": 0
            }
          },
          {
            "synth_index": 2,
            "mute": false,
            "synth": {
              "oscillator": {
                "type": "sine"
              },
              "envelope": {
                "attack": 0,
                "decay": 0,
                "sustain": 0.01,
                "release": 0.1
              }
            },
            "tremolo_effect": {
              "frequency": 0,
              "depth": 0
            }
          }
        ]
      }
    };

    var update_global_config = [];
    var simple_update_test_data_selection = [];
    var play_function = [];
    var stop_function = [];
    var global_update_method = [];
    var out_trigger_sound_function = [];
    var just_rotate_function = [];



    function retrive_linear_list_based_on_type(type) {
      var random_value_start, get_second_value, get_final_result, random_index, random_index2;
      var temp_list = [];
      switch (type) {
          case 'up_up':
              //get first random value 
              random_value_start = getRandomArbitrary(-1, 0.25);
              get_second_value = getRandomArbitrary(random_value_start, 0.75);
              get_final_result = getRandomArbitrary(get_second_value, 1);

              // get random index
              random_index = getRandomInt(2, 14);
              random_index2 = 16 - random_index;

              break;
          case 'up_down':

              random_value_start = getRandomArbitrary(-1, 0.75);
              get_second_value = getRandomArbitrary(random_value_start, 1);
              get_final_result = getRandomArbitrary(get_second_value, -1);

              // get random index
              random_index = getRandomInt(2, 14);
              random_index2 = 16 - random_index;

              break;
          case 'down_up':

              random_value_start = getRandomArbitrary(0.75, 0.1);
              get_second_value = getRandomArbitrary(-1, random_value_start);
              get_final_result = getRandomArbitrary(get_second_value, 1);

              // get random index
              random_index = getRandomInt(2, 14);
              random_index2 = 16 - random_index;

              break;
          case 'down_down':

              random_value_start = getRandomArbitrary(0.75, 0.1);
              get_second_value = getRandomArbitrary(-0.65, random_value_start);
              get_final_result = getRandomArbitrary(get_second_value, -1);

              // get random index
              random_index = getRandomInt(2, 14);
              random_index2 = 16 - random_index;

              break;
      }
      temp_list = generate_trend_data_by_serveral_key_point([random_value_start, get_second_value, get_final_result], [random_index, random_index2], 0);
      return temp_list;
  }

    async function send_few_value_to_server(index, methods) {
      if (index != 0) {

          switch (methods) {
              case 'single_linear':

                  var list_of_possibilities = ["up_up", "up_down", "down_up", "down_down"];
                  //get a random possibility
                  var type = list_of_possibilities[Math.floor(Math.random() * list_of_possibilities.length)];
                  var data = process_list_to_json(retrive_linear_list_based_on_type(type));
                  sendData(methods, data);
                  break;
              case 'double_linear':


                  var list_of_possibilities = ["up_up", "up_down", "down_up", "down_down"];
                  //get a random possibility
                  var type = list_of_possibilities[Math.floor(Math.random() * list_of_possibilities.length)];
                  var type2 = list_of_possibilities[Math.floor(Math.random() * list_of_possibilities.length)];

                  var data = process_list_to_json_two_dataset(retrive_linear_list_based_on_type(type), retrive_linear_list_based_on_type(type2));
                  sendData(methods, data);
                  break;
              case 'single_cycle':
                  var amplitude = Math.random() * 0.75 + 0.25;
                  var frequency = Math.random() * 4 + 1;
                  var phase = Math.random() * Math.PI * 2;

                  var data = process_list_to_json(generate_sinwave(amplitude, frequency, phase, 0, 16), this.config.noise_level);
                  sendData(methods, data);
                  break;
              case 'double_cycle':
                  var amplitude = Math.random() * 0.75 + 0.25;
                  var frequency = Math.random() * 4 + 1;
                  var phase = Math.random() * Math.PI * 2;

                  var amplitude2 = Math.random() * 0.75 + 0.25;
                  var frequency2 = Math.random() * 4 + 1;
                  var phase2 = Math.random() * Math.PI * 2;

                  var data = process_list_to_json_two_dataset(generate_sinwave(amplitude, frequency, phase, 0, 16), generate_sinwave(amplitude2, frequency2, phase2, 0, 16), this.config.noise_level);
                  sendData(methods, data);
                  break;
              case 'single_pulse':
                  var amplitude = Math.random() * 0.75 + 0.25;
                  var frequency = Math.random() * 1 + 0.5;
                  var phase = Math.random() * Math.PI * 2;

                  var data = process_list_to_json(generate_pulse_wave(amplitude, frequency, phase, 0, 16), this.config.noise_level);
                  sendData(methods, data);
                  break;
              case 'double_pulse':
                  var amplitude = Math.random() * 0.75 + 0.25;
                  var frequency = Math.random() * 1 + 0.5;
                  var phase = Math.random() * Math.PI * 2;

                  var data = process_list_to_json_two_dataset(generate_pulse_wave(amplitude, frequency, phase, 0, 16), generate_pulse_wave(amplitude2, frequency2, phase2, 0, 16), this.config.noise_level);
                  sendData(methods, data);
                  break;
              case 'single_random':

                  var data = process_list_to_json(generate_random_data(-1, 1, 16), 0);
                  sendData(methods, data);
                  break;
              case 'double_random':

                  var data = process_list_to_json_two_dataset(generate_random_data(-1, 1, 16), generate_random_data(-1, 1, 16), 0);
                  sendData(methods, data);
                  break;

          }
          await new Promise(r => setTimeout(r, 50));
          this.send_few_value_to_server(index - 1, methods);
      }


  }

  var output_data = [];

  var global_data_save = [];