import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Community from "./pages/Community";
import PostDetail from "./pages/PostDetail";
import NewPost from "./pages/NewPost";
import Guide from "./pages/Guide";
import MapPage from "./pages/MapPage";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Itinerary from "./pages/Itinerary";
import TourCourse from "./pages/TourCourse";
import NaverMapPage from "./pages/NaverMapPage";
import SharedItinerary from "./pages/SharedItinerary";
import EditItinerary from "./pages/EditItinerary";
import CollaborativeItinerary from "./pages/CollaborativeItinerary";

function Router() {
  return (
    <div className="page-shell min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/community" component={Community} />
        <Route path="/community/new" component={NewPost} />
        <Route path="/community/:id" component={PostDetail} />
        <Route path="/guide" component={Guide} />
        <Route path="/map" component={MapPage} />
        <Route path="/profile" component={Profile} />
        <Route path="/itinerary" component={Itinerary} />
        <Route path="/tour" component={TourCourse} />
        <Route path="/naver-map" component={NaverMapPage} />
        <Route path="/itinerary/:shareId" component={SharedItinerary} />
        <Route path="/itinerary/:id/edit" component={EditItinerary} />
        <Route path="/itinerary/:id/collaborate" component={CollaborativeItinerary} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
