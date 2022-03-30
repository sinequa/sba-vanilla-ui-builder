///////////////////////////////////////////////////////////
// Plugin UIBuilder : file UiBuilderPlugin.cs
//

using System.IO;
using Sinequa.Common;
using Sinequa.Plugins;
using Sinequa.Search.JsonMethods;
using Sinequa.Configuration.Resource;

namespace Sinequa.Plugin
{
	public class MakeStaticWorkspace : JsonMethodPlugin
	{
		public override JsonMethodAuthLevel GetRequiredAuthLevel()
		{
			return JsonMethodAuthLevel.User;
		}

		public override void OnPluginMethod()
		{
			Sys.Log("Plugin UI Builder - MakeStaticWorkspace: Start");

			// Get workspace name and check path
			var workspaceName = JsonRequest.ValueStr("workspaceName");
			if(workspaceName == null) {
				JsonResponse.Set("error", "Missing 'workspaceName' in request");
				Method.HttpErrorCode = 400;
				return;
			}
			string workspacePath = Path.Combine(Resources.SBAPath, workspaceName);
			if(!Directory.Exists(workspacePath)) {
				JsonResponse.Set("error", $"Workspace {workspacePath} does not exist");
				Method.HttpErrorCode = 400;
				return;
			}

			// Get configuration as JSON
			var config = JsonRequest.GetAsArray("config");
			if(config == null || !config.IsArray()) {
				JsonResponse.Set("error", "Missing 'config' in request, or it is not an array");
				Method.HttpErrorCode = 400;
				return;
			}
			var configStr = Json.Serialize(config);

			// Write config to a file in the workspace
			var configFileName = "ui-builder-config.json";
			var configFile = Path.Combine(workspacePath, configFileName);
			Sys.Log("Copying config to the workspace ", configFile);
			File.WriteAllText(configFile, configStr);

			// Find Node/NPM executable
			var root = Sys.DistribPath();
			var node = Path.Combine(root, "programs", "win", "node");
			if(!Directory.Exists(node)){
				JsonResponse.Set("error", $"Could not find node's directory: {node}");
				Method.HttpErrorCode = 500;
				return;
			}
			var versions = new ListStr(Directory.GetDirectories(node));
			if(versions.Count == 0) {
				JsonResponse.Set("error", $"No version of node installed in {node}");
				Method.HttpErrorCode = 500;
				return;
			}
			versions.Sort(SortFlags.SortAlphaNum); // Most recent is last
			var npm = Path.Combine(node, versions.GetLast(), "npm.cmd");

			if(!File.Exists(npm)) {
				JsonResponse.Set("error", $"Could not find npm installed in {npm}");
				Method.HttpErrorCode = 500;
				return;
			}
			
			// Run schematic "make-static" to transform the workspace folder
			string arguments = $"run --scripts-prepend-node-path=true ng generate ngx-ui-builder:make-static -- --config={configFileName}";
			System.Diagnostics.Process process = new System.Diagnostics.Process();
			process.StartInfo = new System.Diagnostics.ProcessStartInfo()
			{
				CreateNoWindow = true,
				RedirectStandardOutput = true,
				RedirectStandardError = true,
				UseShellExecute = false,
				WorkingDirectory = workspacePath,
				FileName = npm,
				Arguments = arguments
			};
			process.Start();
			
            string result = process.StandardOutput.ReadToEnd();
			string error = process.StandardError.ReadToEnd();

			JsonResponse.Set("trace", result);
			if(!Str.IsEmpty(error)) {
				JsonResponse.Set("error", "Failed to run the make-static script");
				Json details = Json.NewObject();
				details.Set("trace", error);
				details.Set("command", npm);
				details.Set("arguments", arguments);
				JsonResponse.Set("details", details);
				Method.HttpErrorCode = 500;
				return;
			}

			// Create a Zip File with the transformed workspace
			var zipName = "workspace-static.zip";
			var target = Path.Combine(workspacePath,zipName);
			var excludedFolders = "node_modules;.git;dist";
			var res = Zip.Dir2Zip(workspacePath,target,6,false,false,true,excludedFolders);
			Fs.GetList("");

			if(res) {
				JsonResponse.Set("status", "Workspace successfully exported and compressed");
				JsonResponse.Set("workspace", workspaceName);
				JsonResponse.Set("zipName", zipName);
			}
			else {
				JsonResponse.Set("error", $"Failed to create zip file");
				Method.HttpErrorCode = 500;
				return;
			}

			Sys.Log("Plugin UI Builder - MakeStaticWorkspace: End");
			base.OnPluginMethod();
		}

	}

	public class DownloadExportedWorkspace : JsonMethodPlugin
	{
		public override JsonMethodAuthLevel GetRequiredAuthLevel()
		{
			return JsonMethodAuthLevel.User;
		}

		public override bool OnInitJsonFormat()
		{
			Method.MethodFormat = JsonMethodFormat.Post_Json_To_Blob;
			return true;
		}
		
		public override void OnPluginMethod()
		{
			Sys.Log("Plugin UI Builder - DownloadExportedWorkspace: Start");

			// Get workspace name and check path
			var workspaceName = JsonRequest.ValueStr("workspaceName");
			if(workspaceName == null) {
				JsonResponse.Set("error", "Missing 'workspaceName' in request");
				Method.HttpErrorCode = 400;
				return;
			}
			string workspacePath = Path.Combine(Resources.SBAPath, workspaceName);
			if(!Directory.Exists(workspacePath)) {
				JsonResponse.Set("error", $"Workspace {workspacePath} does not exist");
				Method.HttpErrorCode = 400;
				return;
			}

			// Get zip file name and verify it
			var zipName = JsonRequest.ValueStr("zipName");
			if(zipName == null) {
				JsonResponse.Set("error", "Missing 'workspaceName' in request");
				Method.HttpErrorCode = 400;
				return;
			}
			var zipPath = Path.Combine(workspacePath, zipName);
			if(zipName.Contains("/") || zipName.Contains("\\") || !File.Exists(zipPath)) {
				JsonResponse.Set("error", $"Invalid zip file name {zipName}");
				Method.HttpErrorCode = 400;
				return;
			}

			// Load the zip file and return it
			Method.BlobResponse = Fs.FileToBlob(zipPath);
			Method.BlobResponseFilename = zipName;
			Method.BlobResponseForceDownload = true;

			Sys.Log("Plugin UI Builder - DownloadExportedWorkspace: End");
			base.OnPluginMethod();
		}
	}
}
