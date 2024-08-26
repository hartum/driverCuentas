# Firebase Crashlytics
-keep class com.google.firebase.crashlytics.** { *; }
-keep class com.google.firebase.analytics.** { *; }
-keep class com.google.android.gms.measurement.** { *; }
-keepattributes *Annotation*
-keepclassmembers class ** {
    @com.google.firebase.crashlytics.internal.common.** *;
}
-keepclassmembers class ** {
    @com.google.firebase.crashlytics.internal.model.** *;
}
-dontwarn com.google.firebase.crashlytics.**
-dontwarn com.google.firebase.analytics.**
-dontwarn com.google.android.gms.measurement.**
