using System;
using System.IO;
using System.Windows.Forms;
using System.Collections.Generic;
using System.Linq;
using SLOBSharp.Client;
using SLOBSharp.Client.Requests;
using SLOBSharp.Client.Responses;

namespace ConfigurationTool
{
	public partial class ConfigurationTool : Form
	{
		protected SlobsPipeClient _slobs;
        protected dynamic configOptions;

        public ConfigurationTool()
		{
			InitializeComponent();
			_slobs = new SlobsPipeClient("slobs");

            if (!File.Exists("configuration.json"))
			{
                File.Create("configuration.json");
			}

            string json = File.ReadAllText("configuration.json");
            configOptions = Newtonsoft.Json.JsonConvert.DeserializeObject(json);

            populateConnections();
            populateTable();
        }

        // Populate the OBS and Rocket League connections from the configuration file
        private void populateConnections()
		{
            string obsHostnameURL = Convert.ToString(configOptions["connections"]["OBSHostname"]);
            string[] obsHostNameSplit = obsHostnameURL.Split('/');
            string[] obsHostname = obsHostNameSplit[2].Split(':');
            string obsAuth = Convert.ToString(configOptions["connections"]["OBSAuth"]);

            obs_ip.Text = obsHostname[0];
            obs_port.Text = obsHostname[1];
            obs_password.Text = obsAuth;

            string rlHostname = Convert.ToString(configOptions["connections"]["RocketLeagueHostname"]);
            string[] rlHostnameSplit = rlHostname.Split(':');

            rl_ip.Text = rlHostnameSplit[0];
            rl_port.Text = rlHostnameSplit[1];
        }

        private IEnumerable<SlobsResult> slobsCommandAsync(string command)
		{
            // Build our request
            var slobsRequest = SlobsRequestBuilder.NewRequest().SetMethod(command).SetResource("ScenesService").BuildRequest();

            // Issue the request
            var slobsRpcResponse = _slobs.ExecuteRequest(slobsRequest);

            // Get the result
            return slobsRpcResponse.Result;
        }

        // Populating the table's data from the configuration file
        private void populateTable()
		{
            List<SlobsResult> scenes = slobsCommandAsync("getScenes").ToList();
            foreach (SlobsResult scene in scenes)
            {
                initialized_comboBox.Items.Add(scene.Name);
                replay_will_end_comboBox.Items.Add(scene.Name);
                replay_end_comboBox.Items.Add(scene.Name);
                podium_start_comboBox.Items.Add(scene.Name);
                match_destroyed_comboBox.Items.Add(scene.Name);
            }

            // Populating scene comboboxes
            initialized_comboBox.SelectedIndex = initialized_comboBox.FindStringExact(
                Convert.ToString(configOptions["scenes"]["initialized"]));
            replay_will_end_comboBox.SelectedIndex = initialized_comboBox.FindStringExact(
                Convert.ToString(configOptions["scenes"]["replay_will_end"]));
            replay_end_comboBox.SelectedIndex = initialized_comboBox.FindStringExact(
                Convert.ToString(configOptions["scenes"]["replay_end"]));
            podium_start_comboBox.SelectedIndex = initialized_comboBox.FindStringExact(
                Convert.ToString(configOptions["scenes"]["podium_start"]));
            match_destroyed_comboBox.SelectedIndex = initialized_comboBox.FindStringExact(
                Convert.ToString(configOptions["scenes"]["match_destroyed"]));

            // Populating scene textboxes
            goal_scored_scene_textBox.Text = Convert.ToString(configOptions["scenes"]["goal_scored"]);
            match_ended_scene_textBox.Text = Convert.ToString(configOptions["scenes"]["match_ended"]);

            // Populating delay textboxes
            initialized_textBox.Text = Convert.ToString(configOptions["delays"]["initialized"]);
            goal_scored_textBox.Text = Convert.ToString(configOptions["delays"]["goal_scored"]);
            replay_will_end_textBox.Text = Convert.ToString(configOptions["delays"]["replay_will_end"]);
            replay_end_textBox.Text = Convert.ToString(configOptions["delays"]["replay_end"]);
            match_ended_textBox.Text = Convert.ToString(configOptions["delays"]["match_ended"]);
            podium_start_textBox.Text = Convert.ToString(configOptions["delays"]["podium_start"]);
            match_destroyed_textBox.Text = Convert.ToString(configOptions["delays"]["match_destroyed"]);

            // Populating enable checkboxes
            initialized_checkBox.Checked = Convert.ToBoolean(configOptions["enable"]["initialized"]);
            goal_scored_checkBox.Checked = Convert.ToBoolean(configOptions["enable"]["goal_scored"]);
            replay_will_end_checkBox.Checked = Convert.ToBoolean(configOptions["enable"]["replay_will_end"]);
            replay_end_checkBox.Checked = Convert.ToBoolean(configOptions["enable"]["replay_end"]);
            match_ended_checkBox.Checked = Convert.ToBoolean(configOptions["enable"]["match_ended"]);
            podium_start_checkBox.Checked = Convert.ToBoolean(configOptions["enable"]["podium_start"]);
            match_destroyed_checkBox.Checked = Convert.ToBoolean(configOptions["enable"]["match_destroyed"]);
        }

        // Whenever one of the scene's comboboxes or textboxes are changed, it updates the configuration
		private void scene_InputChanged(object sender, EventArgs e)
		{
            Control control = (Control)sender;
            string eventName;

            // Removing the end of the string to get the event
            if (control.Name.Contains("comboBox"))
			{
                eventName = control.Name.Replace("_comboBox", "");
            }
            else
			{
                eventName = control.Name.Replace("_scene_textBox", "");
            }

            configOptions["scenes"][eventName] = control.Text;

            string output = Newtonsoft.Json.JsonConvert.SerializeObject(configOptions, Newtonsoft.Json.Formatting.Indented);
            File.WriteAllText("configuration.json", output);
        }

        // Whenever one of the delay's textboxes are changed, it updates the configuration
        private void delay_TextChanged(object sender, EventArgs e)
		{
            TextBox control = (TextBox)sender;
            string eventName = control.Name.Replace("_textBox", "");

            if (control.Text != "")
			{
                int delay = Convert.ToInt32(control.Text);
                configOptions["delays"][eventName] = delay;

                string output = Newtonsoft.Json.JsonConvert.SerializeObject(configOptions, Newtonsoft.Json.Formatting.Indented);
                File.WriteAllText("configuration.json", output);
            }
        }

        // Whenever one of the enable's checkboxes are changed, it updates the configuration
        private void enable_CheckedChanged(object sender, EventArgs e)
        {
            CheckBox control = (CheckBox)sender;
            string eventName = control.Name.Replace("_checkBox", "");

            bool enable = control.Checked;
            configOptions["enable"][eventName] = enable;

            string output = Newtonsoft.Json.JsonConvert.SerializeObject(configOptions, Newtonsoft.Json.Formatting.Indented);
            File.WriteAllText("configuration.json", output);
        }

        // Whenever one of the obs' textboxes are changed, it updates the configuration
        private void obs_TextChanged(object sender, EventArgs e)
		{
            Control control = (Control)sender;
            string eventName = control.Name;
            string newEntry;

            if (eventName == "obs_ip")
			{
                // http://localhost:59650/api
                newEntry = "http://" + control.Text + ":" + obs_port.Text + "/api";
                configOptions["connections"]["OBSHostname"] = newEntry;
            }
            else if (eventName == "obs_port")
			{
                newEntry = "http://" + obs_ip.Text + ":" + control.Text + "/api";
                configOptions["connections"]["OBSHostname"] = newEntry;
            }
            else if (eventName == "obs_password")
            {
                newEntry = control.Text;
                configOptions["connections"]["OBSAuth"] = newEntry;
            }

            string output = Newtonsoft.Json.JsonConvert.SerializeObject(configOptions, Newtonsoft.Json.Formatting.Indented);
            File.WriteAllText("configuration.json", output);
        }

        // Whenever one of the rl's textboxes are changed, it updates the configuration
        private void rl_TextChanged(object sender, EventArgs e)
        {
            Control control = (Control)sender;
            string eventName = control.Name;
            string newEntry;

            if (eventName == "rl_ip")
            {
                newEntry = control.Text + ":" + rl_port.Text;
                configOptions["connections"]["RocketLeagueHostname"] = newEntry;
            }
            else if (eventName == "rl_port")
            {
                newEntry = rl_ip.Text + ":" + control.Text;
                configOptions["connections"]["RocketLeagueHostname"] = newEntry;
            }

            string output = Newtonsoft.Json.JsonConvert.SerializeObject(configOptions, Newtonsoft.Json.Formatting.Indented);
            File.WriteAllText("configuration.json", output);
        }
	}
}
