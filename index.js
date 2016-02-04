module.exports = function () {
  var SimpleEventPlugin = require('react/lib/SimpleEventPlugin');
  var EventPluginHub = require('react/lib/EventPluginHub');
  var EventPluginRegistry = require('react/lib/EventPluginRegistry');

  // This is our hacked TapEventPlugin
  var TapEventPlugin = require('./TapEventPlugin');

  // Remove existing click event
  delete SimpleEventPlugin.eventTypes.click;
  delete EventPluginRegistry.eventNameDispatchConfigs.click;
  delete EventPluginRegistry.registrationNameModules.onClick;
  delete EventPluginRegistry.registrationNameModules.onClickCapture;

  // we have to ovveride 'extractEvents', in order to remove any topClick events
  var originalExtractEvents = SimpleEventPlugin.extractEvents;
  SimpleEventPlugin.extractEvents = function (topLevelType, topLevelTarget, topLevelTargetID, nativeEvent, nativeEventTarget) {
    if (topLevelType === "topClick") {
        return null;
    }

    return originalExtractEvents.call(SimpleEventPlugin, topLevelType, topLevelTarget, topLevelTargetID, nativeEvent, nativeEventTarget);
  }

  // Register new event
  EventPluginHub.injection.injectEventPluginsByName({
    'TapEventPlugin': TapEventPlugin
  });
}
